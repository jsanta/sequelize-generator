import { resolve } from 'path';

// For this validator to be useful
// run `npm install --save ajv typescript-json-schema`
import * as TJS from 'typescript-json-schema';
import * as Ajv from 'ajv';

/**
 * Validates a JSON object against a generated JSON Schema.
 * To generate the schema you first require the valid .ts files
 * where the  model interface is declared. This interfaces must 
 * be (hopefully) simple and have only native types (string, number, 
 * boolean, any). 
 */
export class EntityValidator {
  // As the schema loading is a 'expensive' task, it must be run only once
  // and stores each schema as a key: value pair
  schemaCache: { [schemaObj: string]: any } = {}
  
  /**
   * Loads the json schema and places it on the schemaCache Array
   * @param schemaKey String used as a search key for the json-schema
   * @param filePath Path to the typescrit file used to extract the interface object
   * @param typeName Interface object name (eg IModelObj, where ModelObj is the sequelize Model class)
   */
  loadSchema(schemaKey: string, filePath: string, typeName: string) {
    // All attributes are considered as optional
    // No extra/additional attributes are allowed
    const settings: TJS.PartialArgs = {
      required: false,
      noExtraProps: true,
      ignoreErrors: false
    };
    const compilerOptions: TJS.CompilerOptions = {
      strictNullChecks: true,
      noExtraProps: true,
      ignoreErrors: false
    };
    const tsProgram = TJS.getProgramFromFiles([resolve(filePath)], compilerOptions);

    this.schemaCache[schemaKey] = TJS.generateSchema(tsProgram, typeName, settings);
    return this.schemaCache[schemaKey];
  }

  /**
   * Checks if the given object is or is not an instance of the object type being 
   * validated.
   * @param data Object instance (json object) to be checked
   * @param schemaKey Key used to get the schema. Must be the correct 
   *                  one according to the object type being validated.
   * @returns true if validation succeeds (object can be safely casted to the type being validated), 
   *          false otherwise (should be handled as an Error)
   */
  check(data: any, schemaKey: string): boolean {
    let schema: any;
    if (!this.schemaCache[schemaKey]) {
      // Must load json schema before 
      throw new Error('Antes de validar se debe cargar el json-schema para: ' + schemaKey);
    } else {
      // Using schema cache for schemaKey
      console.log('Usando cache de schema para ', schemaKey);
      schema = this.schemaCache[schemaKey];
    }

    const ajv: Ajv.Ajv   = new Ajv({ allErrors: true, strictKeywords: 'log', verbose: true });
    const valid: boolean = ajv.validate(schema, data) as boolean;
    // If the schema validation fails print to console all errors as a waning
    if (!valid) console.warn(ajv.errors);

    return valid;
  }
}

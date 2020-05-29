import { I<%= classify(name) %> } from 'interface/module'; // CHANGE ME!
// Copy files from node_modules/sequelize-generator-schematic/src/utils 
import { autoImplement } from '../utils'; // Requires extra utils module for additional validations

// Declares a type so all interface properties are optional
// Ref https://stackoverflow.com/questions/54986332/typescript-class-extending-partial-interface
type Optional<%= classify(name) %> = Partial<I<%= classify(name) %>>;

/**
 * This type class is meant to be used 
 */
export class T<%= classify(name) %> extends autoImplement<Optional<%= classify(name) %>>() {
  // Validator is static and declared as any to be initialized from any other place
  static entityValidator: any;
  /**
   * Checks object against the json-schema generated for the parent interface
   * implemented by this type class.
   * @param value Value to be checked 
   * @returns true if validation succeeds (object can be safely casted to the type being validated), 
   *          false otherwise (should be handled as an Error)
   */
  static check(value: any): boolean {
    if (!this.entityValidator) {
      // entityValidator has to be instanced before validating an object
      throw Error('No se puede realizar la validación si no se ha instanciado entityValidator');
    }
    return this.entityValidator.check(value, schemaKey);
  }
  
  /*
  // Constructor if required
  public constructor() {
    super();
  }
  // Other properties and/or functions
  // ...
  */
}

// schemaKey used to retrieve the json validation schema
const schemaKey: string = 'T<%= classify(name) %>';

// Schema loading is placed on a external try so this expensive task takes place when the app is starting.
// Can fail if the EntityValidator is not available.
try {
  // Uses a dynamic import so the type class is not dependant on the entityValidator
  import('../utils').then(
    utils => {
      T<%= classify(name) %>.entityValidator = utils.entityValidator;

      const filePath: string  = './path/to/<%= name %>.model.ts'; // CHANGE ME!
      const typeName: string  = 'I<%= classify(name) %>';
      (utils.entityValidator).loadSchema(schemaKey, filePath, typeName);
    },
    // Could not load utils library
    err => console.error('No se pudo cargar a libreria utils')
  );
} catch (evErr) {
  // Could not load json-schema for schemaKey
  console.error('No fue posible cargar el json-schema para: ', schemaKey, evErr);
}

import { I<%= classify(name) %> } from 'interface/module'; // CHANGE ME!
// Copy files from node_modules/sequelize-generator-schematic/src/utils 
import { autoImplement } from '../utils';

// Declares a type so all interface properties are optional
// Ref https://stackoverflow.com/questions/54986332/typescript-class-extending-partial-interface
type Optional<%= classify(name) %> = Partial<I<%= classify(name) %>>;

/**
 * This type class is meant to be used in both frontend and backend because it doesn't depend on sequelize 
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
  static check(value: any): Promise<boolean> {
    try {
      let result: Promise<boolean>;
      if (!this.entityValidator || !this.entityValidator.schemaCache[schemaKey]) {
        // entityValidator has to be instanced before validating an object
        // Beware: This operation IS SLOW!
        result = _initT<%= classify(name) %>().then(
          ev => { return this.check(value); }
        );
      } else {
        result = Promise.resolve(this.entityValidator.check(value, schemaKey));
      }
      return result;
    } catch (evErr) {
      console.error('No se puede realizar la validación usando schema para ', schemaKey, evErr);
      throw Error(`No se puede realizar la validación usando schema para ${schemaKey}`);
    }
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

async function _initT<%= classify(name) %>() {
  // Schema loading is placed on a external function so this expensive task takes place on demand.
  // Can fail if the EntityValidator is not available.
  try {
    // Uses a dynamic import so the type class is not dependant on the entityValidator
    return import('../utils').then(
      utils => {
        T<%= classify(name) %>.entityValidator = utils.entityValidator;

        const filePath: string = './libs/qpmodel/src/lib/model/global/<%= name %>.model.ts';
        const typeName: string = 'I<%= classify(name) %>';
        // Async schema loading
        // Slow task
        // const schemaPromise: Promise<{ schemaKey: string, schema: any }> = (utils.entityValidator).asyncLoadSchema(schemaKey, filePath, typeName);
        // (utils.typeClassSchemas).push(schemaPromise);
        // schemaPromise.then(
        //   sp => {
        //     utils.entityValidator.schemaCache[sp.schemaKey] = sp.schema;
        //   },
        //   spErr => console.error(spErr)
        // );

        // Sync schema loading
        // Slow task
        const schema: any = (utils.entityValidator).syncLoadSchema(schemaKey, filePath, typeName);
        utils.entityValidator.schemaCache[schemaKey] = schema;

        return T<%= classify(name) %>.entityValidator;
      },
      // Could not load utils library
      err => console.error('No se pudo cargar a libreria utils')
    );
  } catch (evErr) {
    // Could not load json-schema for schemaKey
    console.error('No fue posible cargar el json-schema para: ', schemaKey, evErr);
  }
}
// Not so good idea, because it slows down the application start
// _initT<%= classify(name) %>();

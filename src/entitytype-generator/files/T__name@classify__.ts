import { I<%= classify(name) %> } from 'interface/module'; // CHANGE ME!
import { autoImplement, entityValidator } from '../utils'; // Requires extra utils module for additional validations

// Ref https://stackoverflow.com/questions/54986332/typescript-class-extending-partial-interface
type Optional<%= classify(name) %> = Partial<I<%= classify(name) %>>;
export class T<%= classify(name) %> extends autoImplement<Optional<%= classify(name) %>>() {
  static entityValidator: any;
  static check(value: any): boolean {
    if (!this.entityValidator) {
      throw Error('No se puede realizar la validación si no se ha instanciado entityValidator');
    }
    return this.entityValidator.check(value, schemaKey);
  }
  /*
  // Constructor en caso de ser requerido
  public constructor() {
    super();
  }
  // Otras propiedades y/o funciones
  // ...
  */
}

const schemaKey: string = 'T<%= classify(name) %>';
try {
  T<%= classify(name) %>.entityValidator = entityValidator;

  const filePath: string  = './path/to/<%= name %>.model.ts'; // CHANGE ME!
  const typeName: string  = 'I<%= classify(name) %>';
  entityValidator.loadSchema(schemaKey, filePath, typeName);
} catch (evErr) {
  console.error('No fue posible cargar el json-schema para: ', schemaKey, evErr);
}

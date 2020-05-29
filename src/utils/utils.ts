import { EntityValidator } from './EntityValidator';

/**
 * Does not required explicit declaration of all interface attributes.
 * Ref.: https://stackoverflow.com/questions/54986332/typescript-class-extending-partial-interface
 */
export function autoImplement<T>(): new () => T {
  return class { } as any;
}

// Uses a single instance for all validators 
export let entityValidator: EntityValidator = new EntityValidator();

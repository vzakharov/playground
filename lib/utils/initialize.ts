import _ from "lodash";
import { JsonableObject, asTypeguard, is } from "vovas-utils";

export function typeOf(value: any) {
  return Array.isArray(value)
    ? 'array'
    : value === null
      ? 'null'
      : typeof value;
};

export function isSameTypeAs<S>(sample: S) {
  return asTypeguard<S>(arg => typeOf(arg) === typeOf(sample));
};

export type Initializer<T> = {
  [K in keyof T]: T[K] | ((value: any) => T[K]);
};

export type Initializee<I extends Initializer<any>> =
  I extends Initializer<infer T> ? T : never;
// {
//   [K in keyof I]: I[K] extends (value: any) => infer T ? T : I[K]
// };

export function initialize<T>(
  object: JsonableObject | undefined, 
  initializer: Initializer<T>
) {
  return _.mapValues(initializer, ( defaultValueOrInitializer, key ) => {
    const value = object?.[key];
    const defaultValue = typeof defaultValueOrInitializer === 'function'
      ? defaultValueOrInitializer(value)
      : defaultValueOrInitializer;
    return is.undefined(value)
      ? defaultValue
      : isSameTypeAs(defaultValue)(value)
        ? value
        : defaultValue;
  }) as T;
};
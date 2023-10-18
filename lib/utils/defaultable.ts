import _ from "lodash";
import { Jsonable, JsonableObject, asTypeguard, is } from "vovas-utils";

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

// export type Defaults = Record<string, Jsonable | ((value: Jsonable) => any)>;
export type Defaults<T> = {
  [K in keyof T]: T[K] | ((value: any) => T[K]);
};

// export type InferDefaultTypes<D extends Defaults<any>> = {
//   [K in keyof D]: D[K] extends (value: any) => infer T ? T : D[K];
// };
export type InferDefaultTypes<D extends Defaults<any>> =
  D extends Defaults<infer T> ? T : never;

export function defaultable<T>(
  object: JsonableObject | undefined, 
  defaults: Defaults<T>
) {
  return _.mapValues(defaults, ( defaultValueOrInitializer, key ) => {
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
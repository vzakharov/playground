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

export type Defaults = Record<string, Jsonable | ((value: Jsonable) => any)>;

export type InferDefaultTypes<D extends Defaults> = {
  [K in keyof D]: D[K] extends (value: any) => infer T ? T : D[K];
};

export function defaultable<D extends Defaults>(
  object: JsonableObject | undefined, 
  defaults: D
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
  }) as InferDefaultTypes<D>;
};
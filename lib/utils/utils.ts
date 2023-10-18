import _ from "lodash";
import { Ref, ShallowUnwrapRef } from "vue";

export type RefLike<T> = { value: T };

export type StringKey<T> = Extract<keyof T, string>;

export const stringKeyed = <T extends object>(obj: T) => obj as { [K in StringKey<T>]: T[K] };

export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Returns the intersection of all types in the union `U`.
 * 
 * @template U The union of types to intersect.
 * @returns The intersection of all types in the union `U`.
 */
export type AllOf<U> = 
  ( 
    U extends any 
      ? (k: U) => void 
      : never
  ) extends (
    (k: infer I) => void
  ) 
    ? I 
    : never;

export type IntersectMapValues<Map, Key extends keyof Map> = AllOf<Map[Key]>;

export type MapToGeneric<Map, Key extends keyof Map> = {
  [K in keyof IntersectMapValues<Map, keyof Map>]: K extends keyof Map[Key] ? IntersectMapValues<Map, keyof Map>[K] : never;
};

export type Unfilter<Filter extends Record<string, any>> = {
  [K in keyof Filter]: any
};

export function isAmong<T>(arr: readonly T[]) {
  return (item: any): item is T => arr.includes(item);
};

export function debugAnd<Args, Result>(fn: (...args: Args[]) => Result) {
  return (...args: Args[]) => {
    // debugger;
    return fn(...args);
  }
};

export function create<C extends new (...args: any[]) => any>(Class: C) {
  
  return {

    with: <U extends any[]>(...args: U) => {
      return new Class(...args) as InstanceType<C>;
    },

    withConfig: (config: ConstructorParameters<C>[0]) => {
      return new Proxy(new Class(config), {
        get: (target, prop) => {
          if (prop in target) {
            return target[prop];
          }
          if (prop in target.config) {
            return target.config[prop];
          }
        },
      }) as InstanceType<C> & ConstructorParameters<C>[0];
    }

  };

};

export function setValue<T>(ref: RefLike<T>, value: T) {
  return ref.value = value;
};

export function refsToReactive<T extends Record<string, Ref<any>>>(refsObject: T) {
  const reactiveObject = {};

  for (const key in refsObject) {
    if (refsObject.hasOwnProperty(key)) {
      Object.defineProperty(reactiveObject, key, {
        get: () => refsObject[key].value,
        set: (newValue) => { refsObject[key].value = newValue; },
      });
    }
  }

  return reactive(reactiveObject) as ShallowUnwrapRef<T>;
};

// export type UnwrapRefs<T extends Record<string, Ref<any>>> = {
//   [K in keyof T]: T[K]['value']
// };

export function setAllTo<T>(value: T) {
  return <K extends string>(...keys: K[]) => {
    const result = {};
    for ( const key of keys ) {
      Object.assign(result, { [key]: value })
    }
    return result as Record<K, T>;
  }
};

export const allTrue = setAllTo(true as const);

export type Falsible<T> = T | false | null | undefined | 0 | '';

export function assert<T, G>(
  value: T | G,
  typeguard: (value: T | G) => value is T,
  errorMessage?: string
): asserts value is T {
  if (!typeguard(value)) {
    throw new Error(errorMessage ?? `Value ${value} did not pass typeguard ${typeguard.name}.`);
  }
}
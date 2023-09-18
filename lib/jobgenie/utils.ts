import _ from "lodash";

export type RefLike<T> = { value: T };

export type StringKeys<T> = Extract<keyof T, string>;

export type IsNever<T> = [T] extends [never] ? true : false;

export type UnionToIntersection<U> = 
  ( 
    U extends any 
      ? (k: U) => void 
      : never
  ) extends (
    (k: infer I) => void
  ) 
    ? I 
    : never;

export type IntersectMapValues<Map, Key extends keyof Map> = UnionToIntersection<Map[Key]>;

export type MapToGeneric<Map, Key extends keyof Map> = {
  [K in keyof IntersectMapValues<Map, keyof Map>]: K extends keyof Map[Key] ? IntersectMapValues<Map, keyof Map>[K] : never;
};

export type Unfilter<Filter extends Record<string, any>> = {
  [K in keyof Filter]: any
};

export function findBy<T extends object, Filter extends Partial<T>>(filter: Filter, arr: T[] | readonly T[]) {
  return arr.find(item => _.isMatch(item, filter)) as T & Filter | undefined;
}

export function isAmong<T>(arr: readonly T[]) {
  return (item: any): item is T => arr.includes(item);
};

export function debugAnd<Args, Result>(fn: (...args: Args[]) => Result) {
  return (...args: Args[]) => {
    // debugger;
    return fn(...args);
  }
};

export type WithId = { id: string };

export function withUniqueId() {
  return {
    id: _.uniqueId(`${new Date().toISOString()}_`)
  } as WithId;
};
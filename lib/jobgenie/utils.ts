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

// type TestType1 = 'hello' | 'world';

// type TestType2 = 'hello';

// type TestType3 = TestType2 extends Partial<TestType1> ? true : false; // true
// type TestType4 = TestType1 extends Partial<TestType2> ? true : false; // false

export function forEach<T extends object, K extends keyof T>(obj: T, callback: (value: T[K], key: K) => void) {
  _.forEach(obj, callback as any);
};

export function reactiveValue<T extends object>(ref: Ref<T>) {
  const result = {} as T;
  forEach(ref.value, (value, key) => {
    Object.defineProperty(result, key, {
      get: () => ref.value[key],
      set: (newValue) => ref.value[key] = newValue
    });
  });
  return result;
};
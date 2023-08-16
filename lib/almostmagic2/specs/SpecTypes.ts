export type SpecTypes = {
  number: number;
  boolean: boolean;
  'number[]': number[];
  'string[]': string[];
  string: string;
};

export type SpecType = SpecTypes[keyof SpecTypes];

export type SpecTypeKey<T extends SpecType> = {
  [P in keyof SpecTypes]: SpecTypes[P] extends T ? P : never;
}[keyof SpecTypes];

type TestSpecTypeKey = SpecTypeKey<string[]>; // expected: 'string[]'
type TestSpecTypeKey2 = SpecTypeKey<number>; // expected: 'number'
// type TestSpecTypeKey3 = SpecTypeKey<boolean[]>; // expected: Type 'boolean[]' does not satisfy the constraint 'SpecType'.

export type SpecTypeOrKey<T extends SpecType, What extends 'type' | 'key'> = What extends 'type' ? T : SpecTypeKey<T>;

type TestSpecTypeOrKey = SpecTypeOrKey<string[], 'type'>; // expected: string[]
type TestSpecTypeOrKey2 = SpecTypeOrKey<number[], 'key'>; // expected: 'number[]'

export type SpecTypeKeys<T extends SpecType | Record<string, SpecType>> =
  T extends SpecType
    ? SpecTypeKey<T>
  : {
    [K in keyof T]: SpecTypeKey<T[K]>;
  };

type TestTypeKeys = SpecTypeKeys<{ a: string[], b: number }>; // expected: { a: 'string[]', b: 'number' }
type TestTypeKeys2 = SpecTypeKeys<string[]>; // expected: 'string[]'
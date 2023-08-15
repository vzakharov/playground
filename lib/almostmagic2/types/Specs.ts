export type Specs = string | string[] | Record<string, string>;

export type FitsTemplate<
  Exact extends string | undefined, Prefix extends string | undefined, Suffix extends string | undefined
> =
  ( Exact extends string ? Exact : never )
  | ( Prefix extends string ? `${Prefix}${string}` : never )
  | ( Suffix extends string ? `${string}${Suffix}` : never );

export const endsWith = <S extends string>(str: string, suffix: S): str is `${string}${S}` =>
  str.endsWith(suffix);

export const startsWith = <S extends string>(str: string, prefix: S): str is `${S}${string}` =>
  str.startsWith(prefix);

export const fitsTemplateChecker = <
  Exact extends string | undefined, Prefix extends string | undefined, Suffix extends string | undefined
>(
  exact: Exact, prefix: Prefix, suffix: Suffix
) => 
  (str: string): str is FitsTemplate<Exact, Prefix, Suffix> =>
    str === exact || !!prefix && startsWith(str, prefix) || !!suffix && endsWith(str, suffix);

export type SpecValue = {
  number: FitsTemplate<'number', 'number ', ' (number)'>;
  boolean: FitsTemplate<'boolean', 'true if ', ' (boolean)'>;
  numberArray: FitsTemplate<undefined, 'array of numbers', ' (array of numbers)'>;
  stringArray: FitsTemplate<undefined, 'list of ', ' (array of strings)'>
  // (We had to use "list of" instead of "array of" because then it would work for "array of numbers" as well, as it's not possible to define a TypeScript type that would allow us to distinguish between the two.)
};

export type SpecKey = {
  boolean: FitsTemplate<undefined, `is${Capitalize<string>}`, undefined>;
  stringArray: FitsTemplate<undefined, `${string}Array`, undefined>;
};

export type SpecType = {
  number: number;
  boolean: boolean;
  numberArray: number[];
  stringArray: string[];
  string: string;
}

export type InferTypeFromKey<K extends string> = {
  [P in keyof SpecKey]: K extends SpecKey[P] ? SpecType[P] : never;
}[keyof SpecKey];

type TestInferTypeFromKey = InferTypeFromKey<'isPaid'>; // expected: boolean
type TestInferTypeFromKey2 = InferTypeFromKey<'notesArray'>; // expected: string[]
type TestInferTypeFromKey3 = InferTypeFromKey<'groceries'>; // expected: never

export type InferTypeFromValue<V extends string> = {
  [P in keyof SpecValue]: Lowercase<V> extends SpecValue[P] ? SpecType[P] : never;
}[keyof SpecValue];

type TestInferTypeFromValue = InferTypeFromValue<'number'>; // expected: number
type TestInferTypeFromValue2 = InferTypeFromValue<'true if paid'>; // expected: boolean
type TestInferTypeFromValue3 = InferTypeFromValue<'array of numbers'>; // expected: number[]
type TestInferTypeFromValue4 = InferTypeFromValue<'list of items to buy'>; // expected: string[]


export type ModelOutput<O extends Specs> = 
  O extends string 
    ? InferTypeFromValue<O> extends never
      ? string
      : InferTypeFromValue<O>
  : 
  O extends string[] 
    ? {
      [K in O[number]]: InferTypeFromKey<K> extends never
        ? string
        : InferTypeFromKey<K>;
    }
  : O extends Record<string, string> 
    ? {
      [K in keyof O]: 
        K extends string
          ? InferTypeFromKey<K> extends never
            ? InferTypeFromValue<O[K]> extends never
              ? string
              : InferTypeFromValue<O[K]>
            : InferTypeFromKey<K>
          : never;
    } : never;

export const valueRepresentsNumber = fitsTemplateChecker('number', 'number ', ' (number)');
export const valueRepresentsBoolean = fitsTemplateChecker('boolean', 'true if ', ' (boolean)');
export const keyRepresentsBoolean = fitsTemplateChecker(undefined, 'is', undefined);
export const valueRepresentsNumberArray = fitsTemplateChecker(undefined, 'array of numbers', ' (array of numbers)');
export const valueRepresentsStringArray = fitsTemplateChecker(undefined, 'list of ', ' (array of strings)');
export const keyRepresentsStringArray = fitsTemplateChecker(undefined, undefined, 'Array');

export type GenerateOutput<O extends Specs> = ModelOutput<O>;

export const modelToGenerateOutput = <O extends Specs>(modelOutput: ModelOutput<O>, specs: O) => (
  typeof specs === 'string'
    ? modelOutput[specs]
    : modelOutput 
) as GenerateOutput<O>;

type TestSpecs = {
  groceries: 'list of items to buy';
  unitPrices: 'unit prices for all items (array of numbers)';
  total: 'amount to pay (number)';
  isPaid: 'true if paid';
  notes: 'arbitrary notes';
}

type TestOutputs = ModelOutput<TestSpecs>;

type TestSpecs2 = ['groceriesArray', 'isPaid', 'notes'];

type TestOutputs2 = ModelOutput<TestSpecs2>;

type TestSpec3 = 'List of items to buy';

type TestOutputs3 = ModelOutput<TestSpec3>;

// 
// type TestOutputs = {
//   groceries: string[];
//   unitPrices: number[];
//   total: number;
//   isPaid: boolean;
//   notes: string;
// }

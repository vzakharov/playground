export type Specs = string | string[] | Record<string, string>;

export type EPSTemplate = readonly [string | null, string | null, string | null];
// EPS stands for Exact match, Prefix, Suffix

export type FitsTemplate<T extends EPSTemplate> =
  ( T[0] extends string ? T[0] : never )
  | ( T[1] extends string ? `${T[1]}${string}` : never )
  | ( T[2] extends string ? `${string}${T[2]}` : never );

export const endsWith = <S extends string>(str: string, suffix: S): str is `${string}${S}` =>
  str.endsWith(suffix);

export const startsWith = <S extends string>(str: string, prefix: S): str is `${S}${string}` =>
  str.startsWith(prefix);

export const fitsTemplateChecker = <T extends EPSTemplate>(
  ...[exact, prefix, suffix]: T
) => 
  (str: string): str is FitsTemplate<T> =>
    str === exact || !!prefix && startsWith(str, prefix) || !!suffix && endsWith(str, suffix);

export const specValueTemplates = {
  number: ['number', null, null],
  boolean: ['boolean', null, null],
  numberArray: [null, 'array of numbers', ' (array of numbers)'],
  stringArray: [null, 'list of ', ' (array of strings)'],
  // (We had to use "list of" instead of "array of" because then it would work for "array of numbers" as well, as it's not possible to define a TypeScript type that would allow us to distinguish between the two.)
} as const;

export const specKeyTemplates = {
  boolean: [null, 'is', null],
  stringArray: [null, null, 'Array'],
} as const;

export type EPSTemplates<T extends Record<string, EPSTemplate>> = {
  [K in keyof T]: T[K];
};

export type SpecValueTemplates = EPSTemplates<typeof specValueTemplates>;
export type SpecKeyTemplates = EPSTemplates<typeof specKeyTemplates>;

export type SpecType = {
  number: number;
  boolean: boolean;
  numberArray: number[];
  stringArray: string[];
  string: string;
}

export type InferTypeFromKey<K extends string> = {
  [P in keyof SpecKeyTemplates]: K extends SpecKeyTemplates[P] ? SpecType[P] : never;
}[keyof SpecKeyTemplates];

type TestInferTypeFromKey = InferTypeFromKey<'isPaid'>; // expected: boolean
type TestInferTypeFromKey2 = InferTypeFromKey<'notesArray'>; // expected: string[]
type TestInferTypeFromKey3 = InferTypeFromKey<'groceries'>; // expected: never

export type InferTypeFromValue<V extends string> = {
  [P in keyof SpecValueTemplates]: Lowercase<V> extends SpecValueTemplates[P] ? SpecType[P] : never;
}[keyof SpecValueTemplates];

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

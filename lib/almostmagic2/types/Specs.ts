export type Specs = string | string[] | Record<string, string>;

export type ModelOutput<O extends Specs> = 
  O extends string 
    ? InferTypeFromValue<O>
  : 
  O extends string[] 
    ? {
      [K in O[number]]: InferTypeFromKey<K>;
    }
  : O extends Record<string, string> 
    ? {
      [K in keyof O]: 
        InferTypeFromSpec<O, K>;
    } : never;

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

export type NumberSpecValue = FitsTemplate<'number', 'number ', ' (number)'>;
export type BooleanSpecValue = FitsTemplate<'boolean', 'true if ', ' (boolean)'>;
export type BooleanSpecKey = FitsTemplate<undefined, `is${Capitalize<string>}`, undefined>;
export type ArrayOfNumbersSpecValue = FitsTemplate<undefined, 'array of numbers', ' (array of numbers)'>;
export type ArrayOfStringsSpecValue = Exclude<
  FitsTemplate<undefined, 'array of ', ' (array of strings)'>,
  ArrayOfNumbersSpecValue
>;
export type ArrayOfStringsSpecKey = FitsTemplate<undefined, `${string}Array`, undefined>;


export type InferTypeFromKey<K extends string> =
  K extends BooleanSpecKey
    ? boolean
  : K extends ArrayOfStringsSpecKey
    ? string[]
  : never;

export type InferTypeFromValue<V extends string> =
  Lowercase<V> extends NumberSpecValue
    ? number
  : Lowercase<V> extends BooleanSpecValue
    ? boolean
  : Lowercase<V> extends ArrayOfNumbersSpecValue
    ? number[]
  : Lowercase<V> extends ArrayOfStringsSpecValue
    ? string[]
  : never;

export type InferTypeFromSpec<O extends Record<string, string>, K extends keyof O> =
  K extends string
    ? InferTypeFromKey<K> extends never
      ? InferTypeFromValue<O[K]> extends never
        ? string
        : InferTypeFromValue<O[K]>
      : InferTypeFromKey<K>
    : never;

export const valueRepresentsNumber = fitsTemplateChecker('number', 'number ', ' (number)');
export const valueRepresentsBoolean = fitsTemplateChecker('boolean', 'true if ', ' (boolean)');
export const keyRepresentsBoolean = fitsTemplateChecker(undefined, 'is', undefined);
export const valueRepresentsNumberArray = fitsTemplateChecker(undefined, 'array of numbers', ' (array of numbers)');
export const valueRepresentsStringArray = (value: string): value is ArrayOfStringsSpecValue =>
  !valueRepresentsNumberArray(value)
    && fitsTemplateChecker(undefined, 'array of ', ' (array of strings)')(value);
export const keyRepresentsStringArray = fitsTemplateChecker(undefined, undefined, 'Array');

export type GenerateOutput<O extends Specs> = ModelOutput<O>;

export const modelToGenerateOutput = <O extends Specs>(modelOutput: ModelOutput<O>, specs: O) => (
  typeof specs === 'string'
    ? modelOutput[specs]
    : modelOutput 
) as GenerateOutput<O>;

type TestOutputs = ModelOutput<{
  groceries: 'list of items to buy';
  unitPrices: 'unit prices for all items (array of numbers)';
  total: 'amount to pay (number)';
  isPaid: 'true if paid';
  notesArray: 'arbitrary notes';
}>;

// 
// type TestOutputs = {
//   groceries: string[];
//   unitPrices: number[];
//   total: number;
//   isPaid: boolean;
//   notes: string;
// }

import { MatchingOutput } from ".";
import { SpecTypes } from "./SpecTypes";

export type Specs = string | string[] | Record<string, string>;

export type EPSTemplate = readonly [string | null, string | null, string | null];
// EPS stands for Exact match, Prefix, Suffix

export type MatchesTemplate<T extends EPSTemplate> =
  ( T[0] extends string ? T[0] : never )
  | ( T[1] extends string ? `${T[1]}${string}` : never )
  | ( T[2] extends string ? `${string}${T[2]}` : never );

type TestMatchesTemplate = MatchesTemplate<['boolean', 'true if ', '(boolean)']> 
// expected: "boolean" | `true if ${string}` | `${string}(boolean)`

export const specValueTemplates = {
  number: ['number', null, '(number)'],
  boolean: ['boolean', 'true if ', '(boolean)'],
  'number[]': [null, 'array of numbers', ' (array of numbers)'],
  'string[]': ['array', 'list of ', ' (array of strings)'],
  // (We had to use "list of" instead of "array of" because then it would work for "array of numbers" as well, as it's not possible to define a TypeScript type that would allow us to distinguish between the two.)
  string: [null, 'string', '(string)'],
} as const;

export const specKeyTemplates = {
  boolean: [null, 'is', null],
  // Note: This will also be triggered on "normal" words starting with "is", e.g. "island".
  // TODO: Think of a different way to do this (require an underscore prefix, i.e. "is_paid" instead of "isPaid"?)
  'string[]': [null, null, 'Array'],
  string: [null, null, 'String'],
} as const;

export type EPSTemplates<T extends Record<string, EPSTemplate>> = {
  [K in keyof T]: T[K];
};

export type SpecValueTemplates = EPSTemplates<typeof specValueTemplates>;
export type SpecKeyTemplates = EPSTemplates<typeof specKeyTemplates>;

export type MatchesSpecKey<K extends string> = {
  [P in keyof SpecKeyTemplates]: K extends MatchesTemplate<SpecKeyTemplates[P]> ? SpecTypes[P] : never;
}[keyof SpecKeyTemplates];

type TestInferTypeFromKey = MatchesSpecKey<'isPaid'>; // expected: boolean
type TestInferTypeFromKey2 = MatchesSpecKey<'notesArray'>; // expected: string[]
type TestInferTypeFromKey3 = MatchesSpecKey<'groceries'>; // expected: never

export type MatchesSpecValue<V extends string> = {
  [P in keyof SpecValueTemplates]: Lowercase<V> extends MatchesTemplate<SpecValueTemplates[P]> ? SpecTypes[P] : never;
  // We do lowercase for values because users will often enter descriptions in their preferred casing, and we want to be able to match them all.
}[keyof SpecValueTemplates];

type TestInferTypeFromValue = MatchesSpecValue<'number'>; // expected: number
type TestInferTypeFromValue2 = MatchesSpecValue<'true if paid'>; // expected: boolean
type TestInferTypeFromValue3 = MatchesSpecValue<'array of numbers'>; // expected: number[]
type TestInferTypeFromValue4 = MatchesSpecValue<'list of items to buy'>; // expected: string[]

export type InferTypeFromSpecEntry<O extends Record<string, string>, K extends keyof O> =
  K extends string
    ? MatchesSpecKey<K> extends never
      ? MatchesSpecValue<O[K]> extends never
        ? string
        : MatchesSpecValue<O[K]>
      : MatchesSpecKey<K>
    : never;
import _ from "lodash";

/**
 * Flattens an array (of arbitrary depth) and removes all {@link Falsey} values.
 * @param array - The array to be flattened and compacted.
 * @returns A new array that is a flattened and compacted version of the input array.
 * 
 * @example
 * flatpact([0, 1, [2, 3, undefined ]]); // [1, 2, 3]
 * flatpact(['hello', [false, ['world', null, undefined], 0, 0n, '']]); // ['hello', 'world']
 */
export function flatpact<T>(array: Flatpactable<T>) {
  return _(array)
    .castArray()
    .flattenDeep()
    .compact()
    .value() as T[];
};

/**
 * A type representing an arbitrarily deep array of values, each of which can be either of type T or {@link Falsey}.
 */
export type Flatpactable<T> = T | Falsey | readonly Flatpactable<T>[];


/**
 * A type that represents "falsy" values in JavaScript: `false`, `null`, `undefined`, `0`, `0n`, and `''`.
 */
export type Falsey = false | null | undefined | 0 | 0n | '';

// Example:
flatpact([0, 1, [2, 3, undefined ]]); // [1, 2, 3], type inferred as ( 1 | 2 | 3 )[]
flatpact(['hello', [false, ['world', null, undefined], 0, 0n, '']]); // ['hello', 'world']
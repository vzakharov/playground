import _ from "lodash";

/**
 * Identical to _.compact(_.flatten(array))
 */
export function flatpact<T>(array: readonly Flatpactable<T>[]) {
  return _.compact(_.flatten(array)) as T[];
};

export type Flatpactable<T> = T | Flatpactable<T>[] | Falsey;

export type Falsey = false | null | undefined | 0 | 0n | '';

// Example:
flatpact([0, 1, [2, 3, undefined ]]); // [1, 2, 3], type inferred as ( 1 | 2 | 3 )[]
flatpact(['hello', ['world', false, null, undefined, 0, 0n, '']]); // ['hello', 'world'], type inferred as ( 'hello' | 'world' )[]
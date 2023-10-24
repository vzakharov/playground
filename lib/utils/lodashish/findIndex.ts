import _ from "lodash";

/**
 * Returns the index of the first element in the array that satisfies the provided predicate function. *Unlike the usual lodash/js implementation, this function returns undefined if no element satisfies the predicate.*
 * 
 * @template T The type of the elements in the array.
 * @param {T[]} array The array to search.
 * @param {_.ListIterateeCustom<T, boolean>} predicate The function invoked per iteration.
 * @returns {(number | undefined)} The index of the found element, or undefined if no element satisfies the predicate.
 */
export function findIndex<T>(
  array: readonly T[],
  predicate: _.ListIterateeCustom<T, boolean>,
) {
  const index = _.findIndex(array, predicate);
  return index === -1 ? undefined : index;
};
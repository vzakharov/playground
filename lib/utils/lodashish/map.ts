export function map<T, U>(collection: T[], iteratee: (item: T) => U) {
  return collection.map(iteratee);
};
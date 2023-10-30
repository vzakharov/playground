/**
 * Removes all properties from the given object.
 * @param object - The object to clear.
 */
export function clear<T extends Record<string, any>>(object: T): asserts object is T & Record<string, undefined> {
  for (const key in object) {
    delete object[key];
  }
};
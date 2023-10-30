/**
 * Removes all properties from the given object.
 * @param object - The object to clear.
 */
export function clear<T extends Record<string, any>>(object: T): asserts object is T & Record<string, undefined> {
  for (const key in object) {
    delete object[key];
  }
};

/**
 * Ensures that a value is not undefined. If the value is undefined, an error is thrown with the specified message.
 * @param value - The value to ensure is not undefined.
 * @param message - The error message to throw if the value is undefined.
 * @returns The value if it is not undefined.
 * @throws An error with the specified message if the value is undefined.
 */
export function ensure<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message);
  };
  return value;
};

/**
 * Creates a new object composed of the specified keys from the input object.
 *
 * @template T - The type of the input object.
 * @template K - The type of the keys of the input object to pick.
 * @param {T} object - The input object.
 * @param {K[]} keys - The keys of the input object to pick.
 * @returns {Pick<T, K>} - A new object with only the specified keys from the input object.
 */
export function pick<T extends Record<string, any>, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  const result: any = {};
  for (const key of keys) {
    result[key] = object[key];
  }
  return result;
};
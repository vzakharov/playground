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
 * Checks if a value is among a list of possible values.
 * @param values - The list of possible values.
 * @param value - The value to check.
 * @returns `true` if the value is among the possible values, `false` otherwise, as a type guard.
 */
export function isAmong<Ts extends T, T>(values: readonly Ts[], value: T): value is Ts {
  return values.includes(value as Ts);
}

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

/**
 * Throws an error with the given message.
 * @param message The error message to throw.
 * @throws An error with the given message.
 */
export function $throw(message: string): never {
  throw new Error(message);
};

/**
 * Throws an error with a message indicating that the provided value should not exist.
 * This function is typically used in switch statements to ensure that all possible cases are handled.
 * @param neverItem - The value that should not exist.
 * @returns This function does not return a value; it always throws an error.
 */
export function shouldNotBe(neverItem: never): never {
  throw new Error(`This should not exist: ${neverItem}`);
};
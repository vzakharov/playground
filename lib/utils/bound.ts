/**
 * Returns an object where each function property is bound to the argument.
 */
export function bound<T>(obj: T): T {
  const result: any = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'function') {
      result[key] = value.bind(obj);
    } else {
      result[key] = value;
    }
  }
  return result;
};
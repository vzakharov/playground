export function isFunction<T, A extends any[], R>(arg: T | ((...args: A) => R)): arg is (...args: A) => R {
  return typeof arg === "function";
}
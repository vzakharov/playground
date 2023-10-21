export function isFunction<T>(arg: T): arg is Extract<T, Function> {
  return typeof arg === 'function';
}
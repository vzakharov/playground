/**
 * Makes class instance variables reactive while keeping methods untouched.
 */
export function useReactiveInstance<T extends object>(instance: T) {
  const reactiveInstance = reactive(instance);
  const methods = Object.getOwnPropertyNames(instance)
    .filter(name => typeof (instance as any)[name] === 'function');
  for (const method of methods) {
    ( reactiveInstance as any)[method] = ( instance as any )[method];
  }
  return reactiveInstance as T;
};
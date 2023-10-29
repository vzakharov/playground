/**
 * Morphs an object to a new object, assigning identically named properties from the source object to the target object and deleting properties from the target object that are not present in the source object.
 * 
 * If the source object's type is a subtype of the target object's type, the target object will be type narrowed to the source object's type. Otherwise, the target object will be type narrowed to `never` so that it cannot be accidentally used. If you do need to use it according to the new type, you'll need to typecast it manually using `as`.
 * 
 * This is due to a limitation of TypeScript that doesn’t allow us to assert the target is of the same type as the morphed (i.e. source) object without the latter extending the former.
 */
// export function morph<T extends object, U extends object>(target: T, source: U): asserts target is never {
export function morph<T extends object, U extends T>(target: T, source: U): asserts target is U;
export function morph<T extends object, U extends object>(target: T, source: U): asserts target is never;

export function morph<T extends object, U extends object>(target: T, source: U) {
  for (const key in target) {
    if (!(key in source)) {
      delete target[key];
    }
  }
  Object.assign(target, source);
};
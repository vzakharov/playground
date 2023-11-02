/**
 * Checks if the given class is a subclass of the given parent class.
 * 
 * @template Sub The type of the class to check.
 * @template Super The type of the class to check against.
 * 
 * @param {Sub} subClass The class to check.
 * @param {Super} superClass The class to check against.
 * 
 * @returns {boolean} Whether the given class is a subclass of the given parent class, as a type guard.
 */
export function isSubclass<
  Sub extends new (...args: any[]) => any,
  Super extends new (...args: any[]) => any
>(subClass: Sub, superClass: Super): subClass is Sub & Super {
  return subClass.prototype instanceof superClass;
}
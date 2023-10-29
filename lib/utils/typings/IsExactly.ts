/**
 * Determines if a type `U` is exactly the same as another type `T` (and not just its subset)
 * @template T The type to compare against.
 * @template U The type to check if it is exactly the same as `T`.
 * @returns `true` if `U` is exactly the same as `T`, `false` otherwise.
 */
export type IsExactly<T, U extends T> = Exclude<T, U> extends never ? true : false;

/**
 * If the type `T` is exactly equal to the type `U` (and not just its subset), returns `Then`, otherwise returns `Else`.
 * 
 * @template T - The type to compare.
 * @template U - The type to compare against.
 * @template Then - The type to return if `T` is exactly equal to `U`.
 * @template Else - The type to return if `T` is not exactly equal to `U`.
 */
export type IfExactly<T, U extends T, Then, Else> = IsExactly<T, U> extends true ? Then : Else;


// examples:
type _1 = IsExactly<string, string>; // true
type _2 = IsExactly<string, 'hello' | 'world'>; // false, because Exclude<string, 'hello' | 'world'> is not never
type _3 = IsExactly<number, 1>; // false

// This is useful e.g. when you want to ensure that a type is exactly a union of string literals, not just any string:
type Item = 'table' | 'chair';
type Description = string
type Inventory<T extends string> = 
  IsExactly<string, T> extends true
    ? Record<T, Description | undefined>
    : Record<T, Description>;
// I.e. when we know what items could be, we can safely say that the description for an item is there. On the other hand, if we don't know what items could be and using the broad `string` type, we can't say that the description for an item is there, because it could be any string, and we don't know if the item exists at all.

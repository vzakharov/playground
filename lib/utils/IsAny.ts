export type IsAny<T> = 0 extends (1 & T) ? true : false;

// check:
type _1 = IsAny<any>; // true
type _2 = IsAny<unknown>; // false
type _3 = IsAny<never>; // false
type _4 = IsAny<string>; // false
type _5 = IsAny<number>; // false
type _6 = IsAny<boolean>; // false
type _7 = IsAny<{}>; // false
type _8 = IsAny<[]>; // false
type _9 = IsAny<() => void>; // false

export type IsUnknown<T> = unknown extends T ? IsAny<T> extends true ? false : true : false;

// check:
type _10 = IsUnknown<any>; // false
type _11 = IsUnknown<unknown>; // true
type _12 = IsUnknown<never>; // false
// etc.
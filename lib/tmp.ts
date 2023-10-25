export type Tuplify<Array extends any[]> =
  Array extends [ infer T, ...infer Rest extends any[] ]
    ? [T, ...Tuplify<Rest>]
    : [];

// example:
type Foo = Tuplify<[1, 2, 3]>; // [1, 2, 3]
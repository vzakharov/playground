export type Concat<S extends string[]> = S extends [infer A, ...infer B]
  ? A extends string
    ? B extends string[]
      ? `${A}${Concat<B>}`
      : never
    : never
  : '';

export function concat<S extends string[]>(...strings: S): Concat<S> {
  return strings.join('') as any;
}
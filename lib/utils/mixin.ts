import { UnionToIntersection } from ".";

export function mixin<T, U extends ((base: T) => any)[]>(
  base: T,
  ...mixins: U
): T & UnionToIntersection<ReturnType<U[number]>> {
  return mixins.reduce((base: any, mixin: any) => mixin(base), base);
};
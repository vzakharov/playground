export function keys<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
};
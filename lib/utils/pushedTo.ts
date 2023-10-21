export function pushedTo<Ar extends any[], T extends Ar[number]>(array: Ar, item: T) {
  array.push(item);
  return item;
};
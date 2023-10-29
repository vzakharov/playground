export function allPropsDefined<
  Obj extends object
>(
  obj: Partial<Obj>
): obj is Obj {
  return Object.values(obj).every((value) => value !== undefined);
};

export function undefinedProps<
  Obj extends object
>(
  obj: Partial<Obj>
): (keyof Obj)[] {
  return Object.entries(obj)
    .filter(([key, value]) => value === undefined)
    .map(([key]) => key as keyof Obj);
};
import _ from "lodash";

const idBrand = Symbol('id');

// export type WithId = { id: string };
export type Id<Brand extends symbol = typeof idBrand> = Branded<string, Brand>;

export type WithId<Brand extends symbol = typeof idBrand> = {
  id: Id<Brand>;
};

export function withUniqueId() {
  return {
    id: _.uniqueId(`${new Date().toISOString()}_`)
  } as WithId;
};

export type WithKeys<K extends string> = {
  [P in K]: string;
};

export function findBy<T extends object, Filter extends Partial<T>>(filter: Filter, arr: T[] | readonly T[]) {
  return arr.find(item => _.isMatch(item, filter)) as T & Filter | undefined;
};

export type Branded<T, B extends symbol> = T & { [brand in B]: never };
import _ from "lodash";
import { Branded } from "./Branded";

const idBrand = Symbol('id');

// export type WithId = { id: string };
export type Id<Brand extends symbol = typeof idBrand> = Branded<string, Brand>;

export type WithId<Brand extends symbol = typeof idBrand> = {
  id: Id<Brand>;
};

export function withUniqueId<Brand extends symbol = typeof idBrand>() {
  return {
    id: _.uniqueId(`${new Date().toISOString()}_`)
  } as WithId<Brand>;
};

export type WithKeys<K extends string> = {
  [P in K]: string;
};

export function findBy<T extends object, Filter extends Partial<T>>(filter: Filter, arr: T[] | readonly T[]) {
  return arr.find(item => _.isMatch(item, filter)) as T & Filter | undefined;
};
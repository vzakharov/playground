import _ from "lodash";

export type WithId = { id: string };

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
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
import _ from "lodash";
import { JobGenieChat, Tool } from "~/lib/jobgenie";
import { data } from "./data";
import { findBy, findOrCreateChat as baseFindOrCreateChat } from "~/lib/genie";


export function findOrCreateChat<T extends Tool>(type: T, id: string) {
  return baseFindOrCreateChat(data, type, id) as JobGenieChat<T>;
};
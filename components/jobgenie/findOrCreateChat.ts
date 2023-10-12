import _ from "lodash";
import { JobGenieChat, ChatType } from "~/lib/jobgenie";
import { data } from "./data";
import { findBy, findOrCreateChat as baseFindOrCreateChat } from "~/lib/genie";


export function findOrCreateChat<T extends ChatType>(type: T, id: string) {
  return baseFindOrCreateChat(data, type, id) as JobGenieChat<T>;
};
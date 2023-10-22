import _ from "lodash";
import { JobGenieChat, Tool } from "~/lib/jobgenie";
import { globalData } from "./data";
import { findBy, findOrCreateChat as baseFindOrCreateChat } from "~/lib/genie";


export function findOrCreateChat<T extends Tool>(type: T, id: string) {
  return baseFindOrCreateChat(globalData, type, id) as JobGenieChat<T>;
};
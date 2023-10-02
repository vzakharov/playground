import _ from "lodash";
import { AppChat, ChatType, findBy } from "~/lib/jobgenie";
import { data } from "./data";


export function findOrCreateChat<T extends ChatType>(type: T) {
  const { chats } = data;
  const chat = findBy({ type }, chats);
  if (!chat) {
    chats.push({ type, messages: [] });
    return _.last(chats) as AppChat<T>;
  }
  return chat as AppChat<T>;
}

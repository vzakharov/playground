import _ from "lodash";
import { useLocalReactive } from "use-vova";
import { AppChat, ChatType, defaultData, findBy } from "~/lib/jobgenie";

export const data = useLocalReactive('jobgenie-data', defaultData);

export function findOrCreateChat<T extends ChatType>(type: T) {
  const { chats } = data;
  const chat = findBy({ type }, chats);
  if ( !chat ) {
    chats.push({ type, messages: [] });
    return _.last(chats) as AppChat<T>;
  }
  return chat as AppChat<T>;
}
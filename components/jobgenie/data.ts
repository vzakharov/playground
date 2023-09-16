import { AppChat, AppData, ChatType, defaultData, findBy } from "~/lib/jobgenie";
import _ from "lodash";
import { useLocalReactive, useLocalRef } from "use-vova";
import { also } from "vovas-utils";

export const data = useLocalReactive('jobgenie-data', defaultData);

export function findOrCreateChat<T extends ChatType>(type: T) {
  const { chats } = data;
  // debugger
  // const chat = (
  //   findBy({ type }, chats)
  //     ?? also(
  //       { type, messages: [] },
  //       chat => chats.push(chat)
  //     ) 
  // );
  const chat = findBy({ type }, chats);
  if ( !chat ) {
    chats.push({ type, messages: [] });
    return _.last(chats) as AppChat<T>;
  }
  return chat as AppChat<T>;
}
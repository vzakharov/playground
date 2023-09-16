import { AppChat, AppData, ChatType, findBy, forEach, reactiveValue } from "~/lib/jobgenie";
import _ from "lodash";
import { useLocalReactive, useLocalReactiveRef, useLocalRef } from "use-vova";
import { also } from "vovas-utils";

export const dataRef = useLocalReactiveRef<AppData>('jobgenie', {
  chats: [],
  assets: {}
});

export const data = reactiveValue(dataRef);

export const dataLoadedTimestamp = useLocalRef('jobgenie-data-loaded', Date.now())

export function findOrCreateChat<T extends ChatType>(type: T) {
  const { chats } = data;
  return (
    findBy({ type }, chats)
      ?? also(
        { type, messages: [] },
        chat => chats.push(chat)
      ) 
  ) as AppChat<T>;
}
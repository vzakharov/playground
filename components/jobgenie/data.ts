import { AppChat, AppData, ChatType, findBy } from "~/lib/jobgenie";
import _ from "lodash";
import { useLocalReactive } from "use-vova";
import { also } from "vovas-utils";

export const data = useLocalReactive<AppData>('jobgenie', {
  chats: [],
  assets: {}
});

export const { chats } = data;

export function findOrCreateChat<T extends ChatType>(type: T) {
  return (
    findBy({ type }, chats)
      ?? also(
        { type, messages: [] },
        chat => chats.push(chat)
      ) 
  ) as AppChat<T>;
}
import _ from "lodash";
import { useLocalReactive } from "use-vova";
import { also } from "vovas-utils";

import { AppData, ChatType } from "~/lib/jobgenie";

export const data = useLocalReactive<AppData>('jobgenie', {});

export const chats = data.chats ?? ( data.chats = [] );

export function findChat(type: ChatType) {
  return _.find(chats, { type }) ?? also({ type, messages: [] }, chat => chats.push(chat));
}
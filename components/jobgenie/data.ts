import { ChatMessage } from "lib/vovas-openai";
import _ from "lodash";
import { useLocalReactive } from "use-vova";
import { also } from "vovas-utils";

import { ChatType } from "components/jobgenie/Chat/types";

export type AppData = Partial<{
  username: string;
  chats: {
    type: ChatType;
    messages: ChatMessage[];
  }[];
}>;


export const appData = useLocalReactive<AppData>('jobgenie', {});

export const chats = appData.chats ?? ( appData.chats = [] );

export function findChat(type: ChatType) {
  return _.find(chats, { type }) ?? also({ type, messages: [] }, chat => chats.push(chat));
}
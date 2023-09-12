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
  dna: string;
}>;


export const data = useLocalReactive<AppData>('jobgenie', {});

export const chats = data.chats ?? ( data.chats = [] );

export function findChat(type: ChatType) {
  return _.find(chats, { type }) ?? also({ type, messages: [] }, chat => chats.push(chat));
}
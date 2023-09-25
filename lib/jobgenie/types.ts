import { forEach } from "vovas-utils";
import { AppChatMessage } from "./AppChatMessage";

export const chatTypes = ['dna', 'resumé', 'job', 'pitch'] as const;

export type ChatType = typeof chatTypes[number];

export type AppChat<T extends ChatType> = {
  type: T;
  messages: AppChatMessage<T>[];
};

export type AppData = {
  username: string | null;
  chats: AppChat<ChatType>[];
};

export const defaultData: AppData = {
  chats: [],
  username: null,
};

export function assertAppData(data: any): asserts data is AppData {
  forEach(defaultData, (value, key) => {
    // return key in data && typeof data[key] === typeof value;
    if ( !(key in data) ) {
      throw new Error(`${key} missing`)
    }
  })
};
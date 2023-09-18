import { forEach } from "vovas-utils";
import { AssetsMap } from ".";
import { AppChatMessage } from "./AppChatMessage";

export const chatTypes = ['dna', 'linkedin', 'job'] as const;

export type ChatType = typeof chatTypes[number];

export type AppChat<T extends ChatType> = {
  type: T;
  messages: AppChatMessage<T>[];
};

export type AppData = {
  username: string | null;
  chats: AppChat<ChatType>[];
  assets: Partial<AssetsMap>;
};

export const defaultData: AppData = {
  chats: [],
  assets: {},
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
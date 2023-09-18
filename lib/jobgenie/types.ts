import { AllAssets } from ".";
import { every, forEach } from "vovas-utils";
import _ from "lodash";
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
  dna: string | null;
  assets: AllAssets;
};

export const defaultData: AppData = {
  chats: [],
  assets: {},
  username: null,
  dna: null
};

export function assertAppData(data: any): asserts data is AppData {
  forEach(defaultData, (value, key) => {
    // return key in data && typeof data[key] === typeof value;
    if ( !(key in data) ) {
      throw new Error(`${key} missing`)
    }
  })
};
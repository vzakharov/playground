import { ChatRole, ChatMessage as RawChatMessage, chatRoles, says as rawSays } from "~/lib/vovas-openai";
import { AllAssets, Assets, withUniqueId } from ".";
import { every, forEach, objectWithKeys } from "vovas-utils";
import _ from "lodash";

export const chatTypes = ['dna', 'linkedin', 'job'] as const;

export type ChatType = typeof chatTypes[number];

export type ContentAndAssets<T extends ChatType> = {
  content: string;
  assets?: Assets<T>;
};

export type AppChatMessage<T extends ChatType, R extends ChatRole = ChatRole> = 
  RawChatMessage<R> 
  & ContentAndAssets<T> 
  & {
    id: string
  };

export const says = objectWithKeys(chatRoles, role =>
  <T extends ChatType>(content: string, params?: Omit<AppChatMessage<T>, 'id' | 'role' | 'content'>) => ({
    ...rawSays[role](content),
    ...params,
    ...withUniqueId()
  })
) as {
  [K in ChatRole]: <T extends ChatType>(content: string, assets?: Assets<T>) => AppChatMessage<T, K>;
};

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
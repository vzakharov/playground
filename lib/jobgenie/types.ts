import { ChatRole, ChatMessage as RawChatMessage } from "~/lib/vovas-openai";
import { AllAssets, Assets } from ".";

export const chatTypes = ['interview', 'linkedin', 'job'] as const;

export type ChatType = typeof chatTypes[number];

export type ContentAndAssets<T extends ChatType> = {
  content: string;
  assets?: Assets<T>;
};

export type AppChatMessage<T extends ChatType, R extends ChatRole = ChatRole> = 
  RawChatMessage<R> & ContentAndAssets<T>;

export type AppChat<T extends ChatType> = {
  type: T;
  messages: AppChatMessage<T>[];
};

export type AppData = {
  username?: string;
  chats: AppChat<ChatType>[];
  dna?: string;
  assets: AllAssets;
};
import { ChatMessage } from "lib/vovas-openai";

export const chatTypes = ['interview'] as const;

export type ChatType = typeof chatTypes[number];

export type AppData = Partial<{
  username: string;
  chats: {
    type: ChatType;
    messages: ChatMessage[];
  }[];
  dna: string;
}>;
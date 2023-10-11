import { AnyChatMessage } from "~/lib/vovas-openai";


export type Template = {
  id: string;
  messages: AnyChatMessage<true>[];
};

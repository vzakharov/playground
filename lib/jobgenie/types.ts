import { AppChatMessage } from "./AppChatMessage";
import { ChatType } from "./ChatType";

export type AppChat<T extends ChatType> = {
  type: T;
  messages: AppChatMessage<T>[];
};


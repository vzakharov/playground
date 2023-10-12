import { JobGenieMessage } from "./JobGenieMessage";
import { ChatType } from "./ChatType";

export type AppChat<T extends ChatType> = {
  type: T;
  messages: JobGenieMessage<T>[];
};


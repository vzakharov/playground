import { GenieMessage } from ".";

export type GenieChat<Type extends string, AK extends string> = {
  messages: GenieMessage<AK>[];
  type: Type;
  id?: string;
};
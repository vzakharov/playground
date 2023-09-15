import { says } from "~/lib/vovas-openai";
import { data } from "../data";
import { AppChatMessage, ChatType } from "lib/jobgenie";

export type AutoMessageMap = {
  [T in ChatType]?: () => AppChatMessage<T>;
};

export const autoMessage: AutoMessageMap = {

  interview: () => says.user(`Hi, I’m ${data.username ?? 'looking for some assistance'}.`)

};
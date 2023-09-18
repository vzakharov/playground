import { data } from "../data";
import { AppChatMessage, ChatType, says } from "~/lib/jobgenie";

export type AutoMessageMap = {
  [T in ChatType]?: () => AppChatMessage<T>;
};

export const autoMessage: AutoMessageMap = {

  dna: () => says.user(`Hi, I’m ${data.username ?? 'looking for some assistance'}.`)

};
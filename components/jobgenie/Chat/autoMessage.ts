import { says } from "~/lib/genie";
import { data } from "../data";
import { JobGenieMessage, ChatType } from "~/lib/jobgenie";

export type AutoMessageMap = {
  [T in ChatType]?: () => JobGenieMessage<T>;
};

export const autoMessage: AutoMessageMap = {

  dna: () => says.user(`Hi, I’m ${data.username ?? 'looking for some assistance'}.`)

};
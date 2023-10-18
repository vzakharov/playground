import { says } from "~/lib/genie";
import { data } from "../data";
import { JobGenieMessage, Tool } from "~/lib/jobgenie";

export type AutoMessageMap = {
  [T in Tool]?: () => JobGenieMessage<T>;
};

export const autoMessage: AutoMessageMap = {

  dna: () => says.user(`Hi, I’m ${data.username ?? 'looking for some assistance'}.`)

};
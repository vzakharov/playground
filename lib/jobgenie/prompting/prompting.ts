import { ChatFunction, ChatFunctionReturns, ChatMessage } from "~/lib/vovas-openai";
import { interviewPromptBuilder } from "./builders/dna";
import { AppData } from "../AppData";
import { ChatType } from "../ChatType";
import { JobGenieMessage } from "../JobGenieMessage";
import { resuméPromptBuilder } from "./builders/resumé";
import { AssetsForChatType, AssetsMap } from "../assets/assets";
import { StringKey, challengePromptBuilder } from "..";
import _ from "lodash";
import { PromptBuilder } from "./PromptBuilder";
import { jobPromptBuilder } from "./builders/job";
import { pitchPromptBuilder } from "./builders/pitch";
import { socialPromptBuilder } from "./builders/social";
import { findBy } from "~/lib/genie";

export type FnPropsFor<T extends ChatType> =
  StringKey<AssetsForChatType<T>> | 'content';

export type ChatFunctionFor<T extends ChatType> = ChatFunction<any, StringKey<AssetsForChatType<T>> | 'content', never>;

export const promptBuilders = [
  interviewPromptBuilder,
  resuméPromptBuilder,
  jobPromptBuilder,
  pitchPromptBuilder,
  challengePromptBuilder,
  socialPromptBuilder
] as const;

export function getPromptBuilder<U extends ChatType>(type: U){
  return findBy({ type }, promptBuilders) as any as PromptBuilder<U, ChatType[]>;
};
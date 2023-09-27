import { ChatFunction, ChatFunctionReturns, ChatMessage } from "~/lib/vovas-openai";
import { interviewPromptBuilder } from "./builders/dna";
import { AppData } from "../types";
import { ChatType } from "../ChatType";
import { AppChatMessage } from "../AppChatMessage";
import { resuméPromptBuilder } from "./builders/resumé";
import { Assets, AssetsMap } from "../assets/assets";
import { StringKey, challengePromptBuilder, findBy } from "..";
import _ from "lodash";
import { PromptBuilder } from "./PromptBuilder";
import { jobPromptBuilder } from "./builders/job";
import { pitchPromptBuilder } from "./builders/pitch";

export type FnPropsFor<T extends ChatType> =
  StringKey<Assets<T>> | 'content';

export type ChatFunctionFor<T extends ChatType> = ChatFunction<any, StringKey<Assets<T>> | 'content', never>;

export const promptBuilders = [
  interviewPromptBuilder,
  resuméPromptBuilder,
  jobPromptBuilder,
  pitchPromptBuilder,
  challengePromptBuilder
] as const;

export function getPromptBuilder<U extends ChatType>(type: U){
  return findBy({ type }, promptBuilders) as any as PromptBuilder<U, ChatType[]>;
};
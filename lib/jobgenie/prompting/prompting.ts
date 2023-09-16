import { ChatFunction, ChatFunctionReturns, ChatMessage } from "~/lib/vovas-openai";
import { interviewPromptBuilder } from "./builders/dna";
import { AppChatMessage, AppData, ChatType } from "../types";
import { linkedinPromptBuilder } from "./builders/linkedin";
import { AssetsMap } from "../assets";
import { StringKeys, findBy } from "..";
import _ from "lodash";
import { PromptBuilder } from "./PromptBuilder";
import { jobPromptBuilder } from "./builders/job";

export type PromptBuilderInput<T extends ChatType> = {
  type: T;
  messages: AppChatMessage<T>[];
  data: AppData;
};

export type FnPropsFor<T extends ChatType> =
  StringKeys<AssetsMap[T]> | 'content';

export type ChatFunctionFor<T extends ChatType> = ChatFunction<any, StringKeys<AssetsMap[T]> | 'content', never>;

export const storedPromptBuilders = [
  interviewPromptBuilder,
  linkedinPromptBuilder,
  jobPromptBuilder
] as const;

export function getPromptBuilder<U extends ChatType>(type: U){
  return findBy({ type }, storedPromptBuilders) as any as PromptBuilder<U>;
};
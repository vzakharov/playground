import { ChatFunction, ChatFunctionReturns, ChatMessage } from "~/lib/vovas-openai";
import { interviewPromptBuilder } from "./builders/interview";
import { AppChatMessage, AppData, ChatType } from "../types";
import { linkedinPromptBuilder } from "./builders/linkedin";
import { AssetsMap } from "../assets";
import { StringKey, findBy } from "..";
import _ from "lodash";
import { PromptBuilder } from "./PromptBuilder";
import { jobPromptBuilder } from "./builders/job";

export type PromptBuilderInput<T extends ChatType> = {
  type: T;
  messages: AppChatMessage<T>[];
  data: AppData;
};

export type FnPropsFor<T extends ChatType> =
  StringKey<AssetsMap[T]> | 'content';

export type ChatFunctionFor<T extends ChatType> = ChatFunction<any, StringKey<AssetsMap[T]> | 'content', never>;

export const storedPromptBuilders = [
  interviewPromptBuilder,
  linkedinPromptBuilder,
  jobPromptBuilder
] as const;

export function getPromptBuilder<U extends ChatType>(type: U){
  return findBy({ type }, storedPromptBuilders) as any as PromptBuilder<U>;
};
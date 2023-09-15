import { ChatFunction, ChatFunctionReturns, ChatMessage } from "~/lib/vovas-openai";
import { interviewPromptBuilder } from "./builders/interview";
import { AppChatMessage, AppData, ChatType } from "../types";
import { linkedinPromptBuilder } from "./builders/linkedin";
import { AssetsMap } from "../assets";
import { findBy } from "..";
import _ from "lodash";
import { PromptBuilder } from "./PromptBuilder";
import { jobPromptBuilder } from "./builders/job";

export type PromptBuilderInput<T extends ChatType> = {
  type: T;
  messages: AppChatMessage<T>[];
  data: AppData;
};

export type ChatFunctionFor<T extends ChatType> = ChatFunction<any, keyof AssetsMap[T] | 'content', undefined>;

export const storedPromptBuilders = [
  interviewPromptBuilder,
  linkedinPromptBuilder,
  jobPromptBuilder
];

export function getPromptBuilder<U extends ChatType>(type: U){
  return findBy({ type }, storedPromptBuilders) as any as PromptBuilder<U>;
};
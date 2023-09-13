import { AnyChatFunction, ChatMessage } from "~/lib/vovas-openai";
import { interviewPrompt as interview } from "./interview";
import { AppData } from "../types";
import { linkedinPrompt as linkedin } from "./linkedin";

export type PromptType = 'interview' | 'linkedin'; // Add more types as needed

export type PromptingParams<Fn extends AnyChatFunction> = {
  systemMessage: string;
  fn?: Fn | false;
};

export type PromptingInput = {
  type: PromptType;
  messages: ChatMessage[];
  data: AppData;
}

export const allPrompts = {
  interview,
  linkedin,
};

export const prompting = (input: PromptingInput) => allPrompts[input.type](input);
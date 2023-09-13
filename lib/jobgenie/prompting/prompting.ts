import { AnyChatFunction, ChatMessage } from "~/lib/vovas-openai";
import { interviewPrompt as interview } from "./interview";

export type PromptType = 'interview'; // Add more types as needed

export type PromptingParams<Fn extends AnyChatFunction> = {
  systemMessage: string;
  fn?: Fn;
};

export type PromptingInput = {
  type: PromptType;
  messages: ChatMessage[];
}

export const prompting = ({ type, messages}: PromptingInput) => ({

  interview,

})[type](messages);
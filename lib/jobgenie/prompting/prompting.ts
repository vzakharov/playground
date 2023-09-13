import { AnyChatFunction, chatFunction } from "~/lib/vovas-openai";
import { systemMessages } from "./system/messages";

export type PromptType = 'interview'; // Add more types as needed

export type PromptingInfo<Fn extends AnyChatFunction> = {
  systemMessage: string;
  fn?: Fn;
};

export const prompting = {
  interview: {
    systemMessage: systemMessages.interview,
    fn: chatFunction(
      'addDna',
      'Adds the DNA (summary) to the user data',
      {
        dna: 'The DNA to add',
        leadIn: 'Some short accompanying text to add before the DNA',
      },
    ),
  }
} as const;
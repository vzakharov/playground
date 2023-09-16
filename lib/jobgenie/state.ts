import { Model } from "lib/vovas-openai";

export const defaultState = {
  usdSpent: 0,
  useGpt4: true,
  savedMsPerPromptJsonChar: {
    'gpt-3.5-turbo': 5,
    'gpt-4': 15,
  }
};

export type State = typeof defaultState;
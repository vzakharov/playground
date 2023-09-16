import { Model } from "lib/vovas-openai";

export const defaultState = {
  usdSpent: 0,
  useGpt4: false,
  savedMsPerPromptJsonChar: {} as { [model in Model]?: number }
};

export type State = typeof defaultState;
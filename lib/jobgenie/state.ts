import { Leftovers } from "./leftovers";
import { ChatType } from "./types";

export const defaultGlobalState = {
  usdSpent: 0,
  useGpt4: true,
  savedMsPerPromptJsonChar: {
    'gpt-3.5-turbo': 5,
    'gpt-4': 15,
  },
  leftoversByChatType: {} as {
    [T in ChatType]?: Leftovers<T>
  }
};

export type GlobalState = typeof defaultGlobalState;
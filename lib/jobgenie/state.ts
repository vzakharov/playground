import { AnyGenerateResult, AnyPostProcessed, ChatMessage, Model } from "lib/vovas-openai";
import { ChatType } from "./types";
import { AppChatMessage } from "./AppChatMessage";

export const defaultState = {
  usdSpent: 0,
  useGpt4: true,
  savedMsPerPromptJsonChar: {
    'gpt-3.5-turbo': 5,
    'gpt-4': 15,
  },
  leftovers: {
    results: [],
    baseId: null,
    selectedIndex: 1, // 1-based, it’s just for the UI
  } as Leftovers<any>,
};

export type Leftovers<T extends ChatType> = {
  results: AppChatMessage<T>[],
  baseId: string | null,
  selectedIndex: number,
};

export type State = typeof defaultState;

export function areLeftoversForMessage<T extends ChatType>(
  leftovers: Leftovers<any>,
  { id }: AppChatMessage<T>
): leftovers is Leftovers<T> {
  return !!id && ( leftovers.baseId === id );
};
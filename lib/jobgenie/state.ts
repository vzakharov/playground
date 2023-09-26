import { AppChatMessage } from "./AppChatMessage";
import { ChatType } from "./types";

export const defaultGlobalState = {
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
  } as Leftovers<any>
};

export type Leftovers<T extends ChatType> = {
  results: AppChatMessage<T>[],
  baseId: string | null,
  selectedIndex: number,
};

export type GlobalState = typeof defaultGlobalState;

export function areLeftoversForMessage<T extends ChatType>(
  leftovers: Leftovers<any>,
  { id }: AppChatMessage<T, "assistant">
): leftovers is Leftovers<T> {
  return !!id && ( leftovers.baseId === id );
};
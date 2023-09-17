import { Charm } from "@jedisct1/charm";
import { AnyGenerateResult, AnyPostProcessed, Model } from "lib/vovas-openai";

export const defaultState = {
  usdSpent: 0,
  useGpt4: true,
  savedMsPerPromptJsonChar: {
    'gpt-3.5-turbo': 5,
    'gpt-4': 15,
  },
  leftovers: {
    results: [],
    hash: '',
    selectedIndex: 1, // 1-based, it’s just for the UI
  } as Leftovers<any>,
};

export type Leftovers<T> = {
  results: T[],
  hash: string,
  selectedIndex: number,
};


export type State = typeof defaultState;

export function areLeftoversForMessage<T>(
  leftovers: Leftovers<any>,
  message: T
): leftovers is Leftovers<T> {
  return leftovers.hash === hash(message);
}

export function hash<T>(message: T) {
  return JSON.stringify(message);
}
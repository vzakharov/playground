import { AnyGenerateResult, Model } from "lib/vovas-openai";

export const defaultState = {
  usdSpent: 0,
  useGpt4: true,
  savedMsPerPromptJsonChar: {
    'gpt-3.5-turbo': 5,
    'gpt-4': 15,
  },
  leftovers: {
    results: [] as AnyGenerateResult['leftovers'],
    hash: '',
  },
};


export type State = typeof defaultState;

export function areLeftoversForMessage<T>(
  leftovers: State['leftovers'], 
  message: T
): leftovers is State['leftovers'] & { 
  results: T[] 
} {
  return leftovers.hash === hash(message);
}

export function hash<T>(message: T) {
  return JSON.stringify(message);
}
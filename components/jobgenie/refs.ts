import { Model } from "lib/vovas-openai";
import { useLocalReactive, useLocalRef } from "use-vova";
import { Resolvable } from "vovas-utils";

export const usdSpent = useLocalRef('jobgenie-usd-spent', 0);
export const useGpt4 = useLocalRef('jobgenie-use-gpt4', false);

export const savedMsPerPromptJsonChar = useLocalReactive<{ 
  [model in Model]?: number 
}>('jobgenie-ms-per-prompt-json-char', {});

export const userMessage = ref('');

export const generating = reactive(new Resolvable({ startResolved: true }));
export const userInput = ref<HTMLInputElement | null>(null);
export const msExpected = ref<number | null>(null);
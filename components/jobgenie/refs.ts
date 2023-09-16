import { Model } from "lib/vovas-openai";
import { useLocalReactive, useLocalRef } from "use-vova";
import { Resolvable } from "vovas-utils";
import { AnySection, sections } from "./sections";
import { defaultState } from "~/lib/jobgenie";

export const state = useLocalReactive('jobgenie-state', {
  ...defaultState,
  selectedSectionId: sections.value[0].id,
});

export const userMessage = ref('');
export const generating = reactive(new Resolvable({ startResolved: true }));
export const userInput = ref<HTMLInputElement | null>(null);
export const msExpected = ref<number | null>(null);
export const dataLastLoaded = ref(Date.now());
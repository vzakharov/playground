import { AppChatMessage, getActiveAssets, Resolvable } from "~/lib/jobgenie";
import { data } from "./data";

export const userMessage = ref('');

export const generating = ref<Resolvable<AppChatMessage<any, 'assistant'>>>();

export const msExpected = ref<number | null>(null);
export const dataLastLoaded = ref(Date.now());

export const activeAssets = computed(() =>
  getActiveAssets(data)
);
import { AppChatMessage, getActiveAssets, ResolvablePromise } from "~/lib/jobgenie";
import { data } from "./data";

export const userMessage = ref('');

export const generating = ref<ResolvablePromise<AppChatMessage<any, 'assistant'>>>();

export const msExpected = ref<number | null>(null);
export const dataLastLoaded = ref(Date.now());

export const activeAssets = computed(() =>
  getActiveAssets(data)
);
import { Resolvable } from "vovas-utils";
import { getActiveAssets } from "~/lib/jobgenie";
import { data } from "./data";

export const userMessage = ref('');
export const generating = reactive(new Resolvable({ startResolved: true }));
export const userInput = ref<HTMLInputElement | null>(null);
export const msExpected = ref<number | null>(null);
export const dataLastLoaded = ref(Date.now());

export const activeAssets = computed(() =>
  getActiveAssets(data)
);
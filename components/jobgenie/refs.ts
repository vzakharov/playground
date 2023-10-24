import { JobGenie } from "~/lib/jobgenie";
import { globalData } from "./data";
import { globalState } from "./state";
import { watch, nextTick } from 'vue';

export const genie = new JobGenie({
  globalData,
  globalState,
});

export const dataLastLoaded = ref(Date.now());
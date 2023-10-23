import { JobGenie } from "~/lib/jobgenie";
import { globalData } from "./data";
import { globalState } from "./state";

export const genie = new JobGenie({
  globalData,
  globalState,
  watch,
});

export const dataLastLoaded = ref(Date.now());
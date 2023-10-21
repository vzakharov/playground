import { JobGenie } from "~/lib/jobgenie";
import { data } from "./data";
import { globalState } from "./state";

export const genie = new JobGenie({
  globalData: data,
  globalState,
  watch,
  alert
});


export const dataLastLoaded = ref(Date.now());
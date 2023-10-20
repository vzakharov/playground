import { JobGenie, Tools, schema, tools } from "~/lib/jobgenie";
import { data } from "./data";
import { globalState } from "./state";
import { ChatController, Genie, ToolName, getActiveAssetsForSet } from "~/lib/genie";

export const genie = new JobGenie({
  data,
  globalState,
  watch,
  alert
});


export const dataLastLoaded = ref(Date.now());
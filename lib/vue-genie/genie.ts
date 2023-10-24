import { JobGenie } from "~/lib/jobgenie";
import { globalState } from "./state";


export const genie = new JobGenie({
  globalData,
  globalState,
});

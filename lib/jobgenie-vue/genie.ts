import { getGlobalState } from "~/lib/genie-vue";
import { tools } from "~/lib/jobgenie";

export const { globalState, initSelectedToolId } = getGlobalState(tools);
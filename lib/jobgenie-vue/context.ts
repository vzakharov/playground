import { tools } from "~/lib/jobgenie/";
import { GlobalContext } from "~/lib/genie-vue";

export const { globalData, globalState } = new GlobalContext('jobgenie', tools)

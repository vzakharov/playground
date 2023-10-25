import { tools } from "~/lib/jobgenie/";
import { GlobalContext } from "~/lib/genie-vue";

export const { data: globalData, state: globalState } = new GlobalContext('jobgenie', tools)

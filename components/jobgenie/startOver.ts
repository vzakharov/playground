import { forEach } from "vovas-utils";
import { globalData } from "~/lib/genie-vue";
import { defaultData } from "~/lib/jobgenie";
import { globalState } from "~/lib/jobgenie-vue";
import { sectionConfigs } from "./sections";

export function startOver() {
  if (window.confirm("Are you sure you want to start over? All current data will be lost.")) {
    // exportData();
    forEach(globalData, (value, key) => {
      globalData[key] = defaultData[key];
    });
    globalState.selectedToolId = Object.keys(sectionConfigs)[0] as any;
    globalState.dataLastLoaded = Date.now();
  }
};

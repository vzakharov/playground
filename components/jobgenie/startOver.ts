import { forEach } from "vovas-utils";
import { defaultData } from "lib/jobgenie";
import { sectionConfigs } from "./sections";
import { globalData, globalState } from "~/lib/vue-genie";

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

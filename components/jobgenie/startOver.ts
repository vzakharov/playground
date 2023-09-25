import { forEach } from "vovas-utils";
import { data } from "./data";
import { defaultData } from "lib/jobgenie";
import { sectionConfigs } from "./sections";
import { globalState } from "./state";
import { dataLastLoaded } from "./refs";

export function startOver() {
  if (window.confirm("Are you sure you want to start over? All current data will be lost.")) {
    // exportData();
    forEach(data, (value, key) => {
      data[key] = defaultData[key];
    });
    globalState.selectedSectionId = sectionConfigs[0].id;
    dataLastLoaded.value = Date.now();
  }
};

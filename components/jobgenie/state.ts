import { ensured, is } from "vovas-utils";
import { useLocalReactive } from "~/composables/useLocalReactive";
import { genieStateInitializer } from "~/lib/genie";
import { sectionIds } from "./sections";

export const initSelectedSectionId = ensured(is.among(sectionIds)).else(sectionIds[0]);

export const globalState = useLocalReactive('jobgenie-state', {
  ...genieStateInitializer,
  selectedSectionId: initSelectedSectionId,
  userMessage: '',
  showIrrelevantMessages: false,
});
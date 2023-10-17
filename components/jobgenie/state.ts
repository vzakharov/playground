import { is, itselfIf } from "vovas-utils";
import { useLocalReactive } from "~/composables/useLocalReactive";
import { sectionIds } from "./sections";
import { defaultGenieState } from "~/lib/genie";

export const initSelectedSectionId = itselfIf(is.among(sectionIds)).else(sectionIds[0]);

export const globalState = useLocalReactive('jobgenie-state', {
  ...defaultGenieState,
  selectedSectionId: initSelectedSectionId,
  userMessage: '',
  showIrrelevantMessages: false as boolean,
});
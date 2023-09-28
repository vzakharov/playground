import { is, itselfIf } from "vovas-utils";
import { useLocalReactive } from "~/composables/useLocalReactive";
import { defaultGlobalState } from "~/lib/jobgenie";
import { sectionIds } from "./sections";


export const globalState = useLocalReactive('jobgenie-state', {
  ...defaultGlobalState,
  selectedSectionId: itselfIf(is.among(sectionIds)).else(sectionIds[0]),
  userMessage: '',
});
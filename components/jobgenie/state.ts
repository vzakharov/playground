import { ensured, is } from "vovas-utils";
import { useLocalReactive } from "~/composables/useLocalReactive";
import { genieStateInitializer } from "~/lib/genie";
import { toolIds } from "~/lib/jobgenie";

export const initSelectedToolId = ensured(is.among(toolIds)).else(toolIds[0]);

export const globalState = useLocalReactive('jobgenie-state', {
  ...genieStateInitializer,
  selectedToolId: initSelectedToolId,
  userMessage: '',
  showIrrelevantMessages: false,
});
import { ensured, is } from "vovas-utils";
import { useLocalReactive } from "~/composables/useLocalReactive";
import { Toolset, genieStateInitializer, getToolIds } from "~/lib/genie";

export function getGlobalState<S extends Toolset>(tools: S) {

  const toolIds = getToolIds(tools);
  
  function initSelectedToolId() {
    return ensured(is.among(toolIds)).else(toolIds[0]);
  };

  return {

    initSelectedToolId,

    globalState: useLocalReactive('jobgenie-state', {
      ...genieStateInitializer,
      selectedToolId: initSelectedToolId(),
      userMessage: '',
      showIrrelevantMessages: false,
      dataLastLoaded: Date.now()
    }),
  };

};
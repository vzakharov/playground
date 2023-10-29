import { Initializee } from "lib/utils";
import { ensured, is } from "vovas-utils";
import { Toolset, globalStateInitializer as baseInitializer, getToolIds } from "~/lib/genie";

export function getInitSelectedToolId<S extends Toolset>(tools: S) {
  const toolIds = getToolIds(tools);
  return ensured(is.among(toolIds)).else(toolIds[0]);
};

export function getGlobalStateInitializer<S extends Toolset>(tools: S) {
  return {
    ...baseInitializer,
    selectedToolId: getInitSelectedToolId(tools),
    userMessage: '',
    showIrrelevantMessages: false,
    dataLastLoaded: Date.now()
  };
};

export type GlobalState<S extends Toolset> = Initializee<ReturnType<typeof getGlobalStateInitializer<S>>>;
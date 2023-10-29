import { GlobalData as BaseGlobalData, Toolset, getGlobalDataInitializer as getBaseInitializer } from "~/lib/genie";
import { migrators } from "./migrators";

export function getGlobalDataInitializer<S extends Toolset>(tools?: S) {
  return {
    ...getBaseInitializer(tools),
    profileSlug: 'default',
    version: migrators.at(-1)?.version,
  };
};

export type GlobalData<S extends Toolset> = ReturnType<typeof getGlobalDataInitializer<S>>;
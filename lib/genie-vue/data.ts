import { GlobalData as BaseGlobalData, Toolset, getGlobalDataInitializer as getBaseInitializer } from "~/lib/genie";

export function getGlobalDataInitializer<S extends Toolset>(tools?: S) {
  return {
    ...getBaseInitializer(tools),
    profileSlug: 'default',
  };
};

export type GlobalData<S extends Toolset> = ReturnType<typeof getGlobalDataInitializer<S>>;
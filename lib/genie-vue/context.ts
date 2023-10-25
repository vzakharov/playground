import { Toolset } from "~/lib/genie";
import { useLocalReactive } from "~/lib/utils-vue";
import { getGlobalDataInitializer, getGlobalStateInitializer, migrators } from ".";

export class GlobalContext<S extends Toolset> {

  constructor(
    public appId: string, public tools: S
  ) { };

  globalData = useLocalReactive(
    `${this.appId}-data`,
    getGlobalDataInitializer(this.tools),
    migrators
  );

  globalState = useLocalReactive(
    `${this.appId}-state`,
    getGlobalStateInitializer(this.tools)
  );

};
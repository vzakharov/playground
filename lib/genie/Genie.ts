import { objectWithKeys, pushedTo } from "~/lib/utils";
import _ from "lodash";
import { ChatController, ChatControllerConfig, GenieData, GenieState, ToolFrom, ToolIdFrom, ToolWithId, Toolset, ValidToolset, findBy, getActiveAssets } from ".";

export type GenieContext<S extends Toolset> = {
  globalData: GenieData<S>;
  globalState: GenieState;
};

export type GenieConfig<S extends Toolset> = GenieContext<S> & {

  watch: <T>(
    watched: T,
    callback: (value: T) => void,
    options?: { immediate: boolean }
  ) => void;
  alert: (message: string) => void;

};

export class Genie<
  S extends Toolset
> {

  tools: S;

  constructor(
    tools: S & ValidToolset<S>,
    public readonly config: GenieConfig<S>,
  ) {
    this.tools = tools;
  };

  get activeAssets() {
    return getActiveAssets(this.config.globalData, this.tools);
  };

};
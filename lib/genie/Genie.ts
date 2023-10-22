import { objectWithKeys, pushedTo } from "~/lib/utils";
import _ from "lodash";
import { BoundTool, Chat, ChatConfig, GenieData, GenieState, ToolFrom, ToolIdFrom, ToolWithId, Toolset, ValidToolset, findBy, getActiveAssets, getActiveAssetsForSet } from ".";

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

  bound: {
    [Id in ToolIdFrom<S>]: BoundTool<S, ToolWithId<S, Id>>;
  }

  constructor(
    public tools: S & ValidToolset<S>,
    public readonly config: GenieConfig<S>,
  ) {
    this.bound = _.fromPairs(
      tools.map( tool => [tool.id, new BoundTool(tool, this)] )
    ) as this['bound'];
  };

  get activeAssets() {
    return getActiveAssetsForSet(this.config.globalData, this.tools);
  };

};
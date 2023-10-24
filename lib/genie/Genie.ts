import _ from "lodash";
import { BoundTool, GenieData, GenieState, ToolIdFrom, ToolWithId, Toolset, ValidToolset, getActiveAssetsForSet } from ".";

export type GenieContext<S extends Toolset> = {
  globalData: GenieData<S>;
  globalState: GenieState;
};

export type GenieConfig<S extends Toolset> = GenieContext<S>;

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
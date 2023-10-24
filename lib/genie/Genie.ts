import _ from "lodash";
import { BoundTool, GenieData, GenieState, ToolIdFrom, ToolWithId, Toolset, ValidToolset, getActiveAssetsForSet } from ".";

export type GenieContext<Set extends Toolset, Data extends GenieData<Set>, State extends GenieState> = {
  globalData: Data;
  globalState: State;
};

export type GenieConfig<Set extends Toolset, Data extends GenieData<Set>, State extends GenieState> =
  GenieContext<Set, Data, State>;

export class Genie<
  Set extends Toolset,
  Data extends GenieData<Set>,
  State extends GenieState
> {

  bound: {
    [Id in ToolIdFrom<Set>]: BoundTool<Set, ToolWithId<Set, Id>, Data, State>
  }

  constructor(
    public tools: Set & ValidToolset<Set>,
    public readonly config: GenieConfig<Set, Data, State>,
  ) {
    this.bound = _.fromPairs(
      tools.map( tool => [tool.id, new BoundTool(tool, this)] )
    ) as this['bound'];
  };

  get activeAssets() {
    return getActiveAssetsForSet(this.config.globalData, this.tools);
  };

};
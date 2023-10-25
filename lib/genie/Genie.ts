import _ from "lodash";
import { BoundTool, GlobalData, GlobalState, ToolIdFrom, ToolWithId, Toolset, ValidToolset, getActiveAssetsForSet } from ".";

export type GenieContext<Set extends Toolset, Data extends GlobalData<Set>, State extends GlobalState> = {
  globalData: Data;
  globalState: State;
};

export type GenieConfig<Set extends Toolset, Data extends GlobalData<Set>, State extends GlobalState> =
  GenieContext<Set, Data, State>;

export type SomeGenie = Genie<Toolset, GlobalData<Toolset>, GlobalState>;

export class Genie<
  Set extends Toolset,
  Data extends GlobalData<Set>,
  State extends GlobalState
> {

  tools: Set;

  bound: {
    [Id in ToolIdFrom<Set>]: BoundTool<Set, ToolWithId<Set, Id>, Data, State>
  }

  constructor(
    tools: Set & ValidToolset<Set>,
    public readonly config: GenieConfig<Set, Data, State>,
  ) {
    this.tools = tools;
    this.bound = _.fromPairs(
      tools.map( tool => [tool.id, new BoundTool(tool, this)] )
    ) as this['bound'];
  };

  get activeAssets() {
    return getActiveAssetsForSet(this.config.globalData, this.tools);
  };

};
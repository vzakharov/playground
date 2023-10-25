import _ from "lodash";
import { BoundTool, GlobalData, GlobalState, ToolIdFrom, ToolWithId, Toolset, ValidToolset, getActiveAssetsForSet } from ".";
import { objectWithKeysOf } from "~/lib/utils";

export type GenieContext<Set extends Toolset, Data extends GlobalData<Set>, State extends GlobalState> = {
  globalData: Data;
  globalState: State;
};

export type GenieConfig<Set extends Toolset, Data extends GlobalData<Set>, State extends GlobalState> =
  GenieContext<Set, Data, State> & {
    reactivity?: {
      reactive<T extends object>(obj: T): T;
    };
  };

export type SomeGenie = Genie<Toolset, GlobalData<Toolset>, GlobalState>;

export class Genie<
  Set extends Toolset,
  Data extends GlobalData<Set>,
  State extends GlobalState
> {

  tools: Set;

  constructor(
    tools: Set & ValidToolset<Set>,
    public readonly config: GenieConfig<Set, Data, State>,
  ) {
    this.tools = tools;
  };

  get bound() {
    return objectWithKeysOf(
      this.tools, 'id',
      tool => new BoundTool(this, tool as any),
    ) as {
      [Id in ToolIdFrom<Set>]: BoundTool<this, Id>;
    };
  };

  get activeAssets() {
    return getActiveAssetsForSet(this.config.globalData, this.tools);
  };

};
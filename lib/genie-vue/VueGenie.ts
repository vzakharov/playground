import { keys, morph } from "~/lib/utils";
import _ from "lodash";
import { Genie, GenieConfig, Toolset, ValidToolset } from "~/lib/genie";
import { DataInputOutput, GlobalData, GlobalState, ProfileManager } from ".";

export class VueGenie<
  Set extends Toolset,
  Data extends GlobalData<Set>,
  State extends GlobalState<Set>
> extends Genie<Set, Data, State> {

  constructor(
    public appId: string,
    tools: Set & ValidToolset<Set>,
    config: Omit<GenieConfig<Set, Data, State>, 'tools'>,
  ) {
    super(tools, config);
  };

  io = reactive( new DataInputOutput(
    `${this.appId}-${this.config.globalData.username}`,
    this.config.globalData, this.config.globalState
  ) );

  profile = reactive( new ProfileManager(this.appId, this.config.globalData, this.config.globalState ) );

};
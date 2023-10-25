import { Genie, GenieConfig, Toolset, ValidToolset } from "~/lib/genie";
import { useLocalReactive } from "~/lib/utils-vue";
import { DataInputOutput, GlobalData, GlobalState, ProfileManager, getGlobalDataInitializer, getGlobalStateInitializer, migrators } from ".";

export class VueGenie<
  Set extends Toolset
> extends Genie<Set, GlobalData<Set>, GlobalState<Set>> {

  constructor(
    public appId: string,
    tools: Set & ValidToolset<Set>
  ) {

    const globalData = useLocalReactive(
      `${appId}-data`,
      getGlobalDataInitializer(tools),
      migrators
    );
  
    const globalState = useLocalReactive(
      `${appId}-state`,
      getGlobalStateInitializer(tools)
    );

    super(tools, { globalData, globalState });
  };

  io = reactive( new DataInputOutput(
    `${this.appId}-${this.config.globalData.username}`,
    this.config.globalData, this.config.globalState
  ) );

  profile = reactive( new ProfileManager(this.appId, this.config.globalData, this.config.globalState ) );

};
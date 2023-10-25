import { Genie, Toolset, ValidToolset } from "~/lib/genie";
import { getDefaultValue } from "~/lib/utils";
import { useLocalReactive } from "~/lib/utils-vue";
import { DataInputOutput, GlobalData, GlobalState, ProfileManager, getGlobalDataInitializer, getGlobalStateInitializer, getInitSelectedToolId, migrators } from ".";

export class VueGenie<
  Set extends Toolset
> extends Genie<Set, GlobalData<Set>, GlobalState<Set>> {

  constructor(
    public appId: string,
    tools: Set & ValidToolset<Set>
  ) {

    super(tools, {

      globalData: useLocalReactive(
        `${appId}-data`,
        getGlobalDataInitializer(tools),
        migrators
      ),

      globalState: useLocalReactive(
        `${appId}-state`,
        getGlobalStateInitializer(tools)
      )

    })

  };

  get defaultData() { return getDefaultValue(getGlobalDataInitializer(this.tools)); }

  get initSelectedToolId() { return getInitSelectedToolId(this.tools); }

  io = reactive( new DataInputOutput(
    `${this.appId}-${this.config.globalData.username}`,
    this.config.globalData, this.config.globalState
  ) );

  profile = reactive( new ProfileManager(
    this.appId, this.config.globalData, this.config.globalState, this.defaultData
  ) );
  

};
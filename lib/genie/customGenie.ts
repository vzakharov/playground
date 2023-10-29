import { Genie, GenieConfig, GlobalData, GlobalState, Toolset, ValidToolset } from ".";

export function customGenie<Set extends Toolset>(
  tools: Set & ValidToolset<Set>,
) {

  return class CustomGenie<Data extends GlobalData<Set>, State extends GlobalState> extends Genie<Set, Data, State> {

    constructor(
      config: Omit<GenieConfig<Set, Data, State>, 'tools'>,
    ) {
      super(tools, config);
    };

  };

};
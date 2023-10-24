import { Genie, GenieConfig, GenieData, GenieState, Toolset, ValidToolset } from ".";

export function customGenie<Set extends Toolset>(
  tools: Set & ValidToolset<Set>,
) {

  return class CustomGenie<Data extends GenieData<Set>, State extends GenieState> extends Genie<Set, Data, State> {

    constructor(
      config: Omit<GenieConfig<Set, Data, State>, 'tools'>,
    ) {
      super(tools, config);
    };

  };

};
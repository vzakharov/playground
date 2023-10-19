import { Genie, GenieConfig, Toolset, ValidToolset } from ".";

export function customGenie<S extends Toolset>(
  tools: ValidToolset<S>,
) {

  return class CustomGenie extends Genie<S> {

    constructor(
      config: Omit<GenieConfig<S>, 'tools'>,
    ) {
      super(tools, config);
    };

  };

};
import { Genie, GenieConfig, Toolset } from ".";

export function customGenie<S extends Toolset, K extends keyof GenieConfig<S>>(
  customConfig: Pick<GenieConfig<S>, K>
) {

  return class CustomGenie extends Genie<S> {

    constructor(
      config: Omit<GenieConfig<S>, K>
    ) {
      super({
        ...config,
        ...customConfig,
      } as GenieConfig<S>);
    };

  };

};
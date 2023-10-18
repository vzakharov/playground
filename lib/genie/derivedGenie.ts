import { Genie, GenieConfig, GenieSchema, PromptBuilders } from ".";

export function derivedGenie<S extends GenieSchema>(
  schema: S,
  promptBuilders: PromptBuilders<S>
) {

  return class DerivedGenie extends Genie<S> {

    constructor(
      config: Omit<GenieConfig<S>, 'schema' | 'promptBuilders'>
    ) {
      super({
        ...config,
        schema,
        promptBuilders
      });
    };

  };

}
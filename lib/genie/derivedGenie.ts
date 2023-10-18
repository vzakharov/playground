import { Genie, GenieConfig, GenieSchema, PromptBuilders } from ".";

/**
 * Function to create a derived Genie class with a specified schema and prompt builders.
 * A "Derived Genie" is a specialized version of the Genie class that has been extended 
 * to include specific schema and prompt builders. This allows for more specific and 
 * controlled usage of the Genie class, tailored to the specific schema and prompt builders provided.
 * 
 * @param schema - The schema that defines the structure of the data.
 * @param promptBuilders - The prompt builders that define how to generate prompts for the data.
 * @returns A derived Genie class.
 */
export function derivedGenie<S extends GenieSchema>(
  schema: S,
  promptBuilders: PromptBuilders<S>
) {

  /**
   * Derived Genie class.
   * This class extends the base Genie class with the provided schema and prompt builders.
   * This allows for the creation of Genie instances that are specifically tailored to 
   * the provided schema and prompt builders.
   */
  return class DerivedGenie extends Genie<S> {

    /**
     * Constructor for the Derived Genie class.
     * @param config - The configuration for the Genie, excluding the schema and prompt builders.
     */
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

};
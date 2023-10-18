import { Genie, GenieConfig } from "~/lib/genie";
import { Schema, promptBuilders, schema } from ".";

export class JobGenie extends Genie<Schema> {

  constructor(
    config: Omit<GenieConfig<Schema>, 'schema' | 'promptBuilders'>
  ) {
    super({
      ...config,
      schema,
      promptBuilders
    });
  };
  
}
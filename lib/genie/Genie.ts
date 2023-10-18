import _ from "lodash";
import { Asset, ChatController, ChatControllerConfig, GenieData, GenieState, PromptBuilder, ResponderMixinConfig, GenieSchema, Tool, defaultGenieState, findBy } from ".";
import { $throw } from "vovas-utils";

export type GenieConfig<S extends GenieSchema> = {
  schema: S;
  data: GenieData<S>;
  globalState: GenieState<S>;
  promptBuilders: {
    readonly [T in Tool<S>]: PromptBuilder<S, T, any>;
  };
} & ResponderMixinConfig;

export class Genie<
  S extends GenieSchema
> {

  chatControllers: {
    [T in Tool<S>]?: ChatController<S, T>[];
  } = {};

  constructor(
    // public readonly schema: S,
    public readonly config: GenieConfig<S>,
  ) { };

  get ChatController() {

    const genie = this;
    const { chatControllers } = this;
    

    return class BoundChatController<T extends Tool<S>> extends ChatController<S, T> {

      constructor(
        config: Omit<ChatControllerConfig<S, T>, keyof GenieConfig<S> | 'promptBuilder'>
      ) {
        const { tool, chatId } = config;
        const controllers = chatControllers[tool] ??= [];
        const oldController = findBy({ config: { chatId } }, controllers);
        if (oldController)
          _.pull(controllers, oldController);

        const promptBuilder = genie.getPromptBuilder(tool);

        super({ ...genie.config, ...config, promptBuilder });

        controllers.push(this);

      };

    };

  };

  getPromptBuilder<T extends Tool<S>>(tool: T) {
    return this.config.promptBuilders[tool];
  };

  get defaultState() {
    return defaultGenieState(this.config.schema);
  }


};
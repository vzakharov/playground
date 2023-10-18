import _ from "lodash";
import { Asset, ChatController, ChatControllerConfig, GenieData, GenieState, PromptBuilder, ResponderMixinConfig, Schema, Tool, findBy } from ".";
import { $throw } from "vovas-utils";

export type GenieConfig<S extends Schema> = {
  schema: S;
  data: GenieData<S>;
  globalState: GenieState;
  promptBuilders: {
    [T in Tool<S>]: PromptBuilder<S, T, any>;
  };
} & ResponderMixinConfig;

export class Genie<
  S extends Schema,
  Ts extends Tool<S> = Tool<S>
> {

  chatControllers: {
    [T in Ts]?: ChatController<S, T>[];
  } = {};

  constructor(
    public readonly config: GenieConfig<S>,
  ) { };

  get ChatController() {

    const genie = this;
    const { chatControllers } = this;
    

    return class BoundChatController<T extends Ts> extends ChatController<S, T> {

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


};
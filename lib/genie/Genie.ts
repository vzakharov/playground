import _ from "lodash";
import { AssetName, ChatController, ChatControllerConfig, GenieData, GenieState, Tool, ResponderMixinConfig, GenieSchema, ToolName, defaultGenieState, findBy, getActiveAssets, Toolset, ValidToolset } from ".";
import { $throw } from "vovas-utils";

export type GenieConfig<S extends Toolset> = {
  tools: ValidToolset<S>;
  data: GenieData<S>;
  globalState: GenieState<S>;
} & ResponderMixinConfig;

export class Genie<
  S extends Toolset
> {

  chatControllers: {
    [T in ToolName<S>]?: ChatController<S, T>[];
  } = {};

  constructor(
    // public readonly schema: S,
    public readonly config: GenieConfig<S>,
  ) { };

  get ChatController() {

    const genie = this;
    const { chatControllers } = this;
    

    return class BoundChatController<T extends ToolName<S>> extends ChatController<S, T> {

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

  getPromptBuilder<T extends ToolName<S>>(tool: T) {
    return this.config.promptBuilders[tool];
  };

  get defaultState() {
    return defaultGenieState(this.config.schema);
  };

  get activeAssets() {
    return getActiveAssets(this.config.data, this.config.schema);
  };

  messageWithActiveAssets<T extends ToolName<S>>(
    controller: ChatController<S, T>
  ) {
    const { messages, config: { tool }} = controller;
    return messages.find(({ assets }) => assets && assets === this.activeAssets[tool])
      ?? $throw(`No message with active assets for ${tool}`);
  };


};
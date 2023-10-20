import _ from "lodash";
import { $throw } from "vovas-utils";
import { ChatController, ChatControllerConfig, GenieData, GenieState, ToolFrom, ToolIdFrom, ToolWithId, Toolset, ValidToolset, defaultGenieState, findBy, getActiveAssets, getActiveAssetsForSet } from ".";

export type GenieConfig<S extends Toolset> = {

  data: GenieData<S>;
  globalState: GenieState<S>;

  watch: <T>(
    watched: T,
    callback: (value: T) => void,
    options?: { immediate: boolean }
  ) => void;
  alert: (message: string) => void;

};

export class Genie<
  S extends Toolset
> {

  chatControllers: {
    [Id in ToolIdFrom<S>]?: ChatController<Id, ToolWithId<S, Id>>[];
  } = {};

  constructor(
    public tools: S & ValidToolset<S>,
    public readonly config: GenieConfig<S>,
  ) { };

  get ChatController() {

    const genie: Genie<S> = this;
    const { chatControllers } = this;
    

    return class BoundChatController<
      Id extends ToolIdFrom<S>
    > extends ChatController<Id, ToolWithId<S, Id>> {

      constructor(
        config: Omit<ChatControllerConfig<Id, ToolWithId<S, Id>>, keyof GenieConfig<S>>
      ) {
        const { tool, chatId } = config;
        const controllers = chatControllers[tool.id] ??= [];
        const oldController = findBy({ config: { chatId } }, controllers);
        if (oldController)
          _.pull(controllers, oldController);

        super({ ...genie.config, ...config } as unknown as ChatControllerConfig<Id, ToolWithId<S, Id>>);

        controllers.push(this);

      };

    };

  };

  get defaultState() {
    return defaultGenieState(this.tools);
  };

  get activeAssets() {
    return getActiveAssets(this.config.data, this.tools);
  };

};
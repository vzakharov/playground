import { objectWithKeys, pushedTo } from "~/lib/utils";
import _ from "lodash";
import { ChatController, ChatControllerConfig, GenieData, GenieState, ToolFrom, ToolIdFrom, ToolWithId, Toolset, ValidToolset, findBy, getActiveAssets } from ".";

export type GenieContext<S extends Toolset> = {
  globalData: GenieData<S>;
  globalState: GenieState;
};

export type GenieConfig<S extends Toolset> = GenieContext<S> & {

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
    [Id in ToolIdFrom<S>]?: ChatController<ToolWithId<S, Id>>[];
  } = {};

  toolsById: {
    [Id in ToolIdFrom<S>]: ToolWithId<S, Id>;
  };

  constructor(
    public tools: S & ValidToolset<S>,
    public readonly config: GenieConfig<S>,
  ) {

    this.toolsById = _.fromPairs(
      _.map(tools, tool => [tool.id, tool])
    ) as this['toolsById'];
    
  };


  createChatController<
    T extends ToolFrom<S>,
  >(config: Omit<ChatControllerConfig<T['id'], T>, keyof GenieConfig<S>>) {

    const { tool, chatId } = config;
    const controllers = this.chatControllers[tool.id as T['id']] ??= [];
    const oldController = findBy({ config: { chatId } }, controllers);
    if (oldController)
      _.pull(controllers, oldController);

    return pushedTo( controllers,
      new ChatController({ ...this.config, ...config } as unknown as ChatControllerConfig<T['id'], T>),
    );

  };

  get activeAssets() {
    return getActiveAssets(this.config.globalData, this.tools);
  };

};
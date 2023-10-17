import _ from "lodash";
import { AssetName, ChatController, ChatControllerConfig, ChatId, GenieChatType, GenieData, GenieState, findBy, Unbrand, $GenieChatType, $GenieChatId, Branded } from ".";

export class Genie<Ts extends GenieChatType> {

  chatControllers: {
    [T in Ts]?: ChatController<Ts, T, AssetName>[];
  } = {};

  constructor(
    public data: GenieData<Ts>,
    public state: GenieState,
  ) { };

  get ChatController() {

    const { data, state: globalState, chatControllers } = this;

    return class BoundChatController<T extends Ts> extends ChatController<Ts, T, AssetName> {

      constructor(
        config: Omit<ChatControllerConfig<Ts, T, AssetName>, 'data' | 'globalState'>,
      ) {
        const { type, chatId } = config;
        const controllers = chatControllers[type] ??= [];
        const oldController = findBy({ config: { chatId } }, controllers);
        if (oldController)
          _.pull(controllers, oldController);

        super({ ...config, data, globalState });

        controllers.push(this);

      };

    };

  };


};
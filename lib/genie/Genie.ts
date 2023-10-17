import _ from "lodash";
import { AssetName, ChatController, ChatControllerConfig, ChatId, GenieChatType, GenieData, GenieState, findBy, Unbrand, $GenieChatType, $GenieChatId, Branded } from ".";

export class Genie<Ts extends GenieChatType> {

  chatControllers: ChatController<Ts, Ts, AssetName>[] = [];

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
        const oldController = findBy({ config: { type, chatId } }, chatControllers);
        if (oldController) {
          console.log("Deleting old chat controller:", oldController);
          _.pull(chatControllers, oldController);
        };

        super({ ...config, data, globalState });

        chatControllers.push(this as ChatController<Ts, Ts, AssetName>);

      };

    };

  };


};
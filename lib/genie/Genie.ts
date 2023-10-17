import _ from "lodash";
import { Asset, ChatController, ChatControllerConfig, GenieData, GenieState, Schema, Tool, findBy } from ".";

export class Genie<
  S extends Schema,
  Ts extends Tool<S> = Tool<S>
> {

  chatControllers: {
    [T in Ts]?: ChatController<S, T>[];
  } = {};

  constructor(
    public schema: S,
    public data: GenieData<S>,
    public state: GenieState,
  ) { };

  get ChatController() {

    const { data, state: globalState, chatControllers } = this;

    return class BoundChatController<T extends Ts> extends ChatController<S, T> {

      constructor(
        config: Omit<ChatControllerConfig<S, T>, 'data' | 'globalState'>,
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
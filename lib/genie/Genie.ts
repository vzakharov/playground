import _ from "lodash";
import { $throw } from "vovas-utils";
import { ChatController, ChatControllerConfig, GenieData, GenieState, ToolFrom, ToolIdFrom, ToolWithId, Toolset, ValidToolset, defaultGenieState, findBy, getActiveAssets, getActiveAssetsForSet } from ".";

export type GenieContext<S extends Toolset> = {
  globalData: GenieData<S>;
  globalState: GenieState<S>;
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
    [Id in ToolIdFrom<S>]?: ChatController<Id, ToolWithId<S, Id>>[];
  } = {};

  constructor(
    public tools: S & ValidToolset<S>,
    public readonly config: GenieConfig<S>,
  ) { };

  createChatController<
    T extends ToolFrom<S>,
  >(config: Omit<ChatControllerConfig<T['id'], T>, keyof GenieConfig<S>>) {
    return new ChatController({ ...this.config, ...config } as unknown as ChatControllerConfig<T['id'], T>);
  }

  get defaultState() {
    return defaultGenieState(this.tools);
  };

  get activeAssets() {
    return getActiveAssets(this.config.globalData, this.tools);
  };

};
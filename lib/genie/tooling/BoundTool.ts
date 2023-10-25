import { undefinedProps } from "~/lib/utils";
import { Asset, AssetForTool, Chat, Genie, GenieConfig, GlobalData, GlobalState, Requires, ToolFrom, ToolIdFrom, ToolWithId, Toolset, getActiveAssetsForSet } from "..";
import { Tool } from './Tool';

export class BoundTool<
  // G extends Genie<Set, any, any>,
  // Set extends Toolset,
  // Id extends ToolIdFrom<Set>,
  G extends Genie<Toolset, any, any>,
  Id extends ToolIdFrom<G['tools']>,
> extends Tool<
  // Id, AssetForTool<ToolWithId<Set, Id>>, ToolWithId<Set, Id>['config']['requires']
  Id, AssetForTool<ToolWithId<G['tools'], Id>>, ToolWithId<G['tools'], Id>['config']['requires']
> {

  constructor(
    public genie: G,
    // tool: ToolWithId<Set, Id>,
    tool: ToolWithId<G['tools'], Id>,
  ) {
    const { id, config } = tool;
    super(id, config);
  };

  chats: Chat<this, G['config']['globalData'], G['config']['globalState']>[] = [];

  chat(config: Omit<Chat<this, any, any>['config'], 'tool' | keyof GenieConfig<any, any, any>>) {
    type GenieConfig = G['config'];
    type GD = GenieConfig['globalData'];
    type GS = GenieConfig['globalState'];
    const { genie, genie: { config: { reactivity } } } = this;
    const chat = new Chat<this, GD, GS>({
      ...config,
      ...genie.config,
      tool: this
    });
    return reactivity?.reactive(chat) ?? chat;
  };

  get missingRequires() {
    const missingRequires = undefinedProps(this.activeAssets);
    return missingRequires.length ? missingRequires : undefined;
  };

  get activeAssets() {
    const { config: { requires }, genie: { config: { globalData } } } = this;
    return getActiveAssetsForSet(globalData, requires);
  };

};
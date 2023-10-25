import { undefinedProps } from "~/lib/utils";
import { AssetForTool, Chat, Genie, GenieConfig, GlobalData, GlobalState, Requires, ToolFrom, Toolset, getActiveAssetsForSet } from "..";
import { Tool } from './Tool';

/**
 * A type alias for any BoundTool instance.
 */
export type AnyBoundTool = BoundTool<Toolset, ToolFrom<Toolset>, GlobalData<Toolset>, GlobalState>;

/**
 * The BoundTool class represents a tool that is bound to a specific Genie instance.
 * A bound tool has access to the Genie's configuration and active assets, and can
 * create chat controllers that are also bound to the same Genie.
 *
 * @template Set The type of the toolset that the Genie is configured with.
 * @template T The type of the tool that is being bound.
 */
export class BoundTool<
  Set extends Toolset,
  T extends ToolFrom<Set>,
  GD extends GlobalData<Set>,
  GS extends GlobalState
> extends Tool<T['id'], AssetForTool<T>, Requires<T>> {

  constructor(
    tool: T,
    public genie: Genie<Set, GD, GS>,
  ) {
    const { id, config } = tool;
    super(id, config);
  };

  chats: Chat<this, GD, GS>[] = [];

  chat(config: Omit<Chat<this, GD, GS>['config'], 'tool' | keyof GenieConfig<Set, GD, GS>>) {
    return new Chat({
      ...config,
      ...this.genie.config,
      tool: this
    });
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
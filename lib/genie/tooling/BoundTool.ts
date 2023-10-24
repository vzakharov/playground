import { undefinedProps } from "~/lib/utils";
import { AssetForTool, Chat, Genie, GenieConfig, GenieData, GenieState, Requires, ToolFrom, Toolset, getActiveAssetsForSet } from "..";
import { Tool } from './Tool';

/**
 * A type alias for any BoundTool instance.
 */
export type AnyBoundTool = BoundTool<Toolset, ToolFrom<Toolset>, GenieData<Toolset>, GenieState>;

/**
 * The BoundTool class represents a tool that is bound to a specific Genie instance.
 * A bound tool has access to the Genie's configuration and active assets, and can
 * create chat controllers that are also bound to the same Genie.
 *
 * @template Set The type of the toolset that the Genie is configured with.
 * @template Tool The type of the tool that is being bound.
 */
export class BoundTool<
  Set extends Toolset,
  Tool extends ToolFrom<Set>,
  Data extends GenieData<Set>,
  State extends GenieState
> extends Tool<Tool['id'], AssetForTool<Tool>, Requires<Tool>> {

  constructor(
    tool: Tool,
    public genie: Genie<Set, Data, State>,
  ) {
    const { id, config } = tool;
    super(id, config);
  };

  chats: Chat<this>[] = [];

  chat(config: Omit<Chat<this>['config'], 'tool' | keyof GenieConfig<Set, Data, State>>) {
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
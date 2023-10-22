import { AssetForTool, ChatController, Genie, GenieConfig, Requires, ToolFrom, Toolset } from "..";
import { Tool } from "./Tool";

/**
 * A type alias for any BoundTool instance.
 */
export type AnyBoundTool = BoundTool<Toolset, ToolFrom<Toolset>>;

/**
 * The BoundTool class represents a tool that is bound to a specific Genie instance.
 * A bound tool has access to the Genie's configuration and active assets, and can
 * create chat controllers that are also bound to the same Genie.
 *
 * @template S The type of the toolset that the Genie is configured with.
 * @template T The type of the tool that is being bound.
 */
export class BoundTool<
  S extends Toolset,
  T extends ToolFrom<S>
> extends Tool<T['id'], AssetForTool<T>, Requires<T>> {

  /**
   * Creates a new BoundTool instance.
   *
   * @param tool The tool to bind.
   * @param genie The Genie to bind the tool to.
   */
  constructor(
    tool: T,
    public genie: Genie<S>
  ) {
    const { id, config } = tool;
    super(id, config);
  };

  /**
   * An array of chat controllers that are bound to this tool.
   */
  chatControllers: ChatController<this>[] = [];

  /**
   * Creates a new chat controller that is bound to this tool.
   *
   * @param config The configuration for the chat controller.
   * @returns The new chat controller.
   */
  chatController(config: Omit<ChatController<this>['config'], 'tool' | keyof GenieConfig<S>>) {
    return new ChatController({
      ...config,
      ...this.genie.config,
      tool: this
    });
  };

  /**
   * Returns an array of the required assets that are currently missing from the Genie's active assets.
   *
   * @returns An array of missing required assets.
   */
  get missingRequires() {
    return this.getMissingRequires(this.genie.activeAssets);
  };

};
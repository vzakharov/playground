import { AssetForTool, ChatController, Genie, GenieConfig, Requires, ToolFrom, Toolset } from "..";
import { Tool } from "./Tool";

export type AnyBoundTool = BoundTool<Toolset, ToolFrom<Toolset>>;

export class BoundTool<
  S extends Toolset,
  T extends ToolFrom<S>
> extends Tool<T['id'], AssetForTool<T>, Requires<T>> {

  constructor(
    tool: T,
    public genie: Genie<S>
  ) {
    const { id, config } = tool;
    super(id, config);
  };

  chatControllers: ChatController<this>[] = [];

  chatController(config: Omit<ChatController<this>['config'], 'tool' | keyof GenieConfig<S>>) {
    return new ChatController({
      ...config,
      ...this.genie.config,
      tool: this
    });
  };

  get missingRequires() {
    return this.getMissingRequires(this.genie.activeAssets);
  };

};

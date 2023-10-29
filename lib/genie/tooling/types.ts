import { ArrayItem, Falsible, Flatpactable, IfExactly, IsExactly, StringKey } from "~/lib/utils";
import { StackUpable } from "~/lib/vovas-openai";
import { Dict, GlobalData, GenieMessage, Tool } from "..";


export type AnyTool = Tool<any, any, any>

export type Toolset = readonly AnyTool[];

export type Requires<T extends AnyTool> = T['config']['requires'];

export type SetFor<T extends AnyTool> = readonly (T | ArrayItem<Requires<T>>)[];

export type ToolFrom<S extends Toolset> = ArrayItem<S>;

export type ToolIdFrom<S extends Toolset> = ToolFrom<S>['id'];

export function getToolIds<S extends Toolset>(tools: S): ToolIdFrom<S>[] {
  return tools.map(tool => tool.id);
};

export type ToolWithId<S extends Toolset, Id extends ToolIdFrom<S>> = Extract<ToolFrom<S>, { id: Id }>;

export function toolWithId<S extends Toolset, Id extends ToolIdFrom<S>>(tools: S, id: Id): ToolWithId<S, Id> {
  return tools.find(tool => tool.id === id) as ToolWithId<S, Id>;
};

export type MissingTool<S extends Toolset> = Exclude<ToolFrom<SetFor<ToolFrom<S>>>, ToolFrom<S>>['id'];

export type ValidToolset<S extends Toolset> = MissingTool<S> extends never 
  ? S 
  : never
  // : `Required tool missing, id = ${MissingTool<S>}`;

export type AssetForTool<T extends AnyTool> = StringKey<T['config']['assets']>;

export type ToTool<ST extends Toolset | AnyTool> = ST extends Toolset ? ToolFrom<ST> : ST;

export type Asset<ST extends Toolset | AnyTool> = AssetForTool<ToTool<ST>>;

export type AssetValues<T extends Toolset | AnyTool> = Dict<Asset<T>>;

export type BuildInput<T extends AnyTool> = {
  messages: GenieMessage<T>[];
  globalData: GlobalData<Requires<T>>;
};

// export type DefiniteAssetValuesForToolId<S extends Toolset, Id extends ToolIdFrom<S>> = {
//   [A in AssetForTool<ToolWithId<S, Id>>]: string;
// };

// export type AssetValuesForToolId<S extends Toolset, Id extends ToolIdFrom<S>> =
//   IfExactly<string, Id,
//     DefiniteAssetValuesForToolId<S, Id>,
//     Partial<DefiniteAssetValuesForToolId<S, Id>>
//   >;

export type AssetValuesForToolId<S extends Toolset, Id extends ToolIdFrom<S>> = {
  [A in AssetForTool<ToolWithId<S, Id>>]: string;
};

export type AssetValuesForSet<S extends Toolset> = {
  [Id in ToolIdFrom<S>]: AssetValuesForToolId<S, Id>;
};

export type BuildCallback<
  Id extends string,
  Asset extends string,
  Reqs extends Toolset
> = (params: {
  numResponses: number;
  shouldGenerateAssets: boolean;
  functionCalled: boolean;
  assets: AssetValuesForSet<Reqs>;
  username: Falsible<string>;
}) => {
  pre?: Flatpactable<string | GenieMessage<Tool<Id, Asset, Reqs>>>;
  post?: Flatpactable<string | GenieMessage<Tool<Id, Asset, Reqs>>>;
};

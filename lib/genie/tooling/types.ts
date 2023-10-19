import { ArrayItem, Falsible, StringKey } from "~/lib/utils";
import { StackUpable } from "~/lib/vovas-openai";
import { Dict, GenieData, GenieMessage, Tool } from "..";


export type AnyTool<
  Id extends string = string,
  Asset extends string = string,
  Set extends Toolset = Toolset
> = Tool<Id, Asset, Set>;

export type Toolset = AnyTool[];

export type Requires<T extends AnyTool> = T['config']['requires'];

export type SetFor<T extends AnyTool> = (T | ArrayItem<Requires<T>>)[];

export type ToolFrom<S extends Toolset> = ArrayItem<S>;

export type ToolIdFrom<S extends Toolset> = ToolFrom<S>['id'];

export function toolIds<S extends Toolset>(tools: S): ToolIdFrom<S>[] {
  return tools.map(tool => tool.id);
}
;

export type ToolWithId<S extends Toolset, Id extends ToolIdFrom<S>> = Extract<ToolFrom<S>, { id: Id; }>;

export function toolWithId<S extends Toolset, Id extends ToolIdFrom<S>>(tools: S, id: Id): ToolWithId<S, Id> {
  return tools.find(tool => tool.id === id) as ToolWithId<S, Id>;
}
;

export type MissingTool<S extends Toolset> = Exclude<ToolFrom<SetFor<ToolFrom<S>>>, ToolFrom<S>>['id'];

export type ValidToolset<S extends Toolset> = MissingTool<S> extends never ? S : `Required tool missing, id = ${MissingTool<S>}`;

export type AssetForTool<T extends AnyTool> = StringKey<T['config']['assets']>;

export type ToTool<ST extends Toolset | AnyTool> = ST extends Toolset ? ToolFrom<ST> : ST;

export type Asset<ST extends Toolset | AnyTool> = AssetForTool<ToTool<ST>>;

export type AssetValues<T extends Toolset | AnyTool> = Dict<Asset<T>>;

export type BuildInput<S extends Toolset, T extends AnyTool> = {
  messages: GenieMessage<T>[];
  data: GenieData<S>;
};

export type AssetValuesForSet<S extends Toolset> = {
  [Id in ToolIdFrom<S>]: {
    [A in AssetForTool<ToolWithId<S, Id>>]: string;
  };
};

export type BuildSystemMessages<Reqs extends Toolset> = (params: {
  numResponses: number;
  requestFunctionCall: boolean;
  functionCalled: boolean;
  assets: AssetValuesForSet<Reqs>;
  username: Falsible<string>;
}) => Record<'pre' | 'post', StackUpable>;

import _ from "lodash";
import { AnyTool, AssetValues, AssetValuesForSet, AssetValuesForToolId, GenieData, SetFor, ToolIdFrom, ToolWithId, Toolset, findBy, toolIds } from "..";
import { objectWithKeys } from "lib/utils";

export function getActiveAssetsForSet<
  S extends Toolset
>(data: GenieData<S>, tools: S): Partial<AssetValuesForSet<S>> {

  return objectWithKeys(
    toolIds(tools), 
    toolId => getActiveAssetsForToolId(data, toolId)
  );

};

export function getActiveAssetsForToolId<
  S extends Toolset,
  Id extends ToolIdFrom<S>
>(data: GenieData<S>, toolId: Id) {

  const chat = findBy({ toolId }, data.chats);

  if (!chat) return undefined;

  const { messages } = chat;

  const { assets } = _(messages)
    .filter(m => !!m.assets)
    .sortBy(m => m.assetsPickedAt ?? 0)
    .last() ?? {};

  if (!assets) return undefined;

  return assets as AssetValuesForToolId<S, Id>;

};

export function getActiveAssetsForTool<
  Id extends string,
  T extends AnyTool<Id>,
  S extends SetFor<T>
>(data: GenieData<S>, tool: T) {

  return getActiveAssetsForToolId(data, tool.id);

};
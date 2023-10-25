import _ from "lodash";
import { AnyTool, AssetValues, AssetValuesForSet, AssetValuesForToolId, GlobalData, SetFor, Tool, ToolIdFrom, ToolWithId, Toolset, findBy, getToolIds } from "..";
import { objectWithKeys } from "~/lib/utils";

export function getActiveAssetsForSet<
  S extends Toolset
>(data: GlobalData<S>, tools: S): Partial<AssetValuesForSet<S>> {

  return objectWithKeys(
    getToolIds(tools), 
    toolId => getActiveAssetsForToolId(data, toolId)
  );

};

export function getActiveAssetsForToolId<
  S extends Toolset,
  Id extends ToolIdFrom<S>
>(data: GlobalData<S>, toolId: Id) {

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
  T extends Tool<Id, any, any>,
  S extends SetFor<T>
>(data: GlobalData<S>, tool: T) {

  return getActiveAssetsForToolId(data, tool.id);

};
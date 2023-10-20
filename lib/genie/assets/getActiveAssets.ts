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

export function getActiveAssets<S extends Toolset>(
  ...args: Parameters<typeof getActiveAssetsForSet<S>>): ReturnType<typeof getActiveAssetsForSet<S>>;
export function getActiveAssets<S extends Toolset, Id extends ToolIdFrom<S>>(
  ...args: Parameters<typeof getActiveAssetsForToolId<S, Id>>): ReturnType<typeof getActiveAssetsForToolId<S, Id>>;
export function getActiveAssets<Id extends string, T extends AnyTool<Id>, S extends SetFor<T>>(
  ...args: Parameters<typeof getActiveAssetsForTool<Id, T, S>>): ReturnType<typeof getActiveAssetsForTool<Id, T, S>>;

export function getActiveAssets(...args: any[]) {
  return typeof args[1] === 'string'
    ? getActiveAssetsForToolId(...args as Parameters<typeof getActiveAssetsForToolId>)
  : Array.isArray(args[1])
    ? getActiveAssetsForSet(...args as Parameters<typeof getActiveAssetsForSet>)
  : getActiveAssetsForTool(...args as Parameters<typeof getActiveAssetsForTool>);
};
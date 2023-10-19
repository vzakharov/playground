import _ from "lodash";
import { AssetValues, AssetValuesForSet, GenieData, ToolIdFrom, ToolWithId, Toolset, findBy, toolIds } from "..";
import { objectWithKeys } from "lib/utils";

export function getActiveAssets<
  S extends Toolset
>(data: GenieData<S>, tools: S): Partial<AssetValuesForSet<S>> {

  return objectWithKeys(
    toolIds(tools), 
    toolId => {
      const chat = findBy({ toolId }, data.chats);

      if (!chat) return undefined;

      const { messages } = chat;

      const { assets } = _(messages)
        .filter(m => !!m.assets)
        .sortBy(m => m.assetsPickedAt ?? 0)
        .last() ?? {};

      if (!assets) return undefined;

      // TODO: check that assets are actually for this tool

      return assets;
    }
  );

};
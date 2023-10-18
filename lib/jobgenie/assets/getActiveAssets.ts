import { findBy } from "~/lib/genie";
import _ from "lodash";
import { objectWithKeys } from "vovas-utils";
import { JobGenieChat, AppData, AssetsForChatType, Tool, tools } from "~/lib/jobgenie";

export function getActiveAssets(data: AppData) {

  const result = objectWithKeys(tools, <T extends Tool>(type: T) => {

    const chat = findBy({ tool: type }, data.chats) as JobGenieChat<T> | undefined;

    if (!chat) return undefined;

    return _(chat.messages)
      .filter(m => !!m.assets)
      .sortBy(m => m.assetsPickedAt ?? 0)
      .last()?.assets;

  }) as {
      [T in Tool]?: AssetsForChatType<T>;
    };
  
  return result;

};
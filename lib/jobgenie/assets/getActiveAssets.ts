import { findBy } from "~/lib/genie";
import _ from "lodash";
import { objectWithKeys } from "vovas-utils";
import { JobGenieChat, AppData, AssetsForChatType, ChatType, chatTypes } from "~/lib/jobgenie";

export function getActiveAssets(data: AppData) {

  const result = objectWithKeys(chatTypes, <T extends ChatType>(type: T) => {

    const chat = findBy({ type }, data.chats) as JobGenieChat<T> | undefined;

    if (!chat) return undefined;

    return _(chat.messages)
      .filter(m => !!m.assets)
      .sortBy(m => m.assetsPickedAt ?? 0)
      .last()?.assets;

  }) as {
      [T in ChatType]?: AssetsForChatType<T>;
    };
  
  return result;

};
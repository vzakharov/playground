import _ from "lodash";
import { objectWithKeys } from "vovas-utils";
import { AppChat, AppData, Assets, ChatType, chatTypes, findBy } from "~/lib/jobgenie";

export function getActiveAssets(data: AppData) {

  return objectWithKeys(chatTypes, <T extends ChatType>(type: T) => {

    const chat = findBy({ type }, data.chats) as AppChat<T> | undefined;

    if (!chat) return undefined;

    return _(chat.messages)
      .filter(m => !!m.assets)
      .sortBy(m => m.assetsPickedAt ?? 0)
      .last()?.assets;

  }) as {
      [T in ChatType]?: Assets<T>;
    };

}
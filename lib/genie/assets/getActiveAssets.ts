import _ from "lodash";
import { objectWithKeys } from "~/lib/utils";
import { AssetMap, AssetsForChatType, GenieChatType, GenieData, findBy, getChatTypes } from "..";

export function getActiveAssets<
  Ts extends GenieChatType
>(data: GenieData<Ts>) {

  const chatTypes = getChatTypes(data.chats);

  const result = objectWithKeys(chatTypes, type => {

    const chat = findBy({ type }, data.chats);
    // TODO: Search by id in addition to type

    if (!chat) return undefined;

    return _(chat.messages)
      .filter(m => !!m.assets)
      .sortBy(m => m.assetsPickedAt ?? 0)
      .last()?.assets;

  });
  
  return result;

};
import { AppChat, Assets, AssetsMap, ChatType, chatTypes, findBy } from "~/lib/jobgenie";
import { objectWithKeys } from "vovas-utils";
import { data } from "./data";
import _ from "lodash";

export const activeAssets = computed<Partial<AssetsMap>>(() => {

  return objectWithKeys(chatTypes, <T extends ChatType>(type: T) => {

    const chat = findBy({ type }, data.chats) as AppChat<T> | undefined;
    
    if ( !chat ) return undefined;

    return chat.messages.findLast(m => m.assets)?.assets;

  })

});
import { AssetName, GenieChat, GenieChatType } from ".";

export function defaultGenieData<T extends GenieChatType>() {
  return ({
    chats: [] as GenieChat<T, AssetName>[],
  });
}

export type GenieData<T extends GenieChatType> = ReturnType<typeof defaultGenieData<T>>;
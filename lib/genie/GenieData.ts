import { AssetName, GenieChat, GenieChatType } from ".";

export function defaultGenieData<Ts extends GenieChatType>() {
  return ({
    chats: [] as GenieChat<Ts, AssetName>[],
  });
}

export type GenieData<T extends GenieChatType> = ReturnType<typeof defaultGenieData<T>>;
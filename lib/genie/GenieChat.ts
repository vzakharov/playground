import { AssetName, Branded, GenieMessage } from ".";

const $genieChatType = Symbol('$GenieChatType');
export type $GenieChatType = typeof $genieChatType;

export type GenieChatType<S extends string = string> = Branded<S, $GenieChatType>;

const $genieChatId = Symbol('$GenieChatId');
export type $GenieChatId = typeof $genieChatId;

export type ChatId = Branded<string, $GenieChatId>;

export type GenieChat<T extends GenieChatType, A extends AssetName> = {
  type: T;
  id: ChatId;
  messages: GenieMessage<A>[];
};

export function getChatTypes<Ts extends GenieChatType>(chats: GenieChat<Ts, AssetName>[]) {
  return chats.map(chat => chat.type);
};
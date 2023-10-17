import { Asset, Branded, GenieMessage, Schema, Tool } from ".";

const $genieChatId = Symbol('$GenieChatId');
export type $GenieChatId = typeof $genieChatId;

export type ChatId = Branded<string, $GenieChatId>;

export type GenieChat<S extends Schema, T extends Tool<S>> = {
  tool: T;
  id: ChatId;
  messages: GenieMessage<S, T>[];
};

export function getChatTypes<S extends Schema, T extends Tool<S>>(chats: GenieChat<S, T>[]) {
  return chats.map(chat => chat.tool);
};
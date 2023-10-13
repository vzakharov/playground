import { AssetName, Branded, GenieMessage } from ".";

const genieChatTypeBrand = Symbol('genieChatType');

export type GenieChatType<S extends string = string> = Branded<S, typeof genieChatTypeBrand>;

const genieChatIdBrand = Symbol('genieChatId');

export type ChatId = Branded<string, typeof genieChatIdBrand>;

export type GenieChat<T extends GenieChatType, A extends AssetName> = {
  type: T;
  id: ChatId;
  messages: GenieMessage<A>[];
};
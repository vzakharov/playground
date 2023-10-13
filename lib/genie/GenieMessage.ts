import { ChatMessage, ChatRole } from "~/lib/vovas-openai";
import { Branded, WithId, WithKeys } from ".";

const assetKeyBrand = Symbol('assetKey');

export type AssetName<S extends string = string> = Branded<S, typeof assetKeyBrand>;

const messageIdBrand = Symbol('messageId');

export type MessageId = Branded<string, typeof messageIdBrand>;

export type GenieMessage<A extends AssetName, R extends ChatRole = ChatRole> =
  ChatMessage<R> & {
    id: MessageId;
    content: string;
    assets?: WithKeys<A>;
    assetsPickedAt?: number;
  };

const test = (message: GenieMessage<AssetName>) => {
  const a = message.id[messageIdBrand];
};
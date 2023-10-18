import { ChatMessage, ChatRole } from "~/lib/vovas-openai";
import { Asset, Branded, GenieSchema, Tool, WithId, WithKeys } from ".";

const $messageId = Symbol('messageId');
export type $MessageId = typeof $messageId;
export type MessageId = Branded<string, $MessageId>;

export type GenieMessage<S extends GenieSchema, T extends Tool<S>, R extends ChatRole = ChatRole> =
  ChatMessage<R> & {
    id: MessageId;
    content: string;
    assets?: WithKeys<Asset<S, T>>;
    assetsPickedAt?: number;
  };
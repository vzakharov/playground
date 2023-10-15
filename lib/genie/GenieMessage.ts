import { ChatMessage, ChatRole } from "~/lib/vovas-openai";
import { AssetName, Branded, WithId, WithKeys } from ".";

const $messageId = Symbol('messageId');
export type $MessageId = typeof $messageId;
export type MessageId = Branded<string, $MessageId>;

export type GenieMessage<A extends AssetName, R extends ChatRole = ChatRole> =
  ChatMessage<R> & {
    id: MessageId;
    content: string;
    assets?: WithKeys<A>;
    assetsPickedAt?: number;
  };
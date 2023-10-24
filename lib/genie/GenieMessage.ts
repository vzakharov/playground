import { ChatMessage, ChatRole } from "~/lib/vovas-openai";
import { AnyTool, AssetValues, Branded } from ".";

const $messageId = Symbol('messageId');
export type $MessageId = typeof $messageId;
export type MessageId = Branded<string, $MessageId>;

export type GenieMessage<T extends AnyTool | undefined, R extends ChatRole = ChatRole> =
  ChatMessage<R> & {
    id: MessageId;
    content: string;
    assets?: T extends AnyTool ? AssetValues<T> : never;
    assetsPickedAt?: number;
  };
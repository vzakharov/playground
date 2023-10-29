import { ChatMessage, ChatRole } from "~/lib/vovas-openai";
import { AnyTool, AssetValues, Branded } from ".";

const $messageId = Symbol('messageId');
export type $MessageId = typeof $messageId;
export type MessageId = Branded<string, $MessageId>;

export type GenieMessage<T extends AnyTool, R extends ChatRole = ChatRole> =
  Omit<ChatMessage<R>, 'function_call'> & {
    id: MessageId;
    content: string;
    assets?: AssetValues<T>;
    assetsPickedAt?: number;
  };
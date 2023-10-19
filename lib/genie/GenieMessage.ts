import { ChatMessage, ChatRole } from "~/lib/vovas-openai";
import { AnyTool, AssetName, AssetValues, Branded, GenieSchema, ToolName, WithId, Dict } from ".";

const $messageId = Symbol('messageId');
export type $MessageId = typeof $messageId;
export type MessageId = Branded<string, $MessageId>;

export type GenieMessage<T extends AnyTool, R extends ChatRole = ChatRole> =
  ChatMessage<R> & {
    id: MessageId;
    content: string;
    assets?: AssetValues<T>;
    assetsPickedAt?: number;
  };
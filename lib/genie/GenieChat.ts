import { AnyTool, AssetName, Branded, GenieMessage, GenieSchema, ToolName } from ".";

const $genieChatId = Symbol('$GenieChatId');
export type $GenieChatId = typeof $genieChatId;

export type ChatId = Branded<string, $GenieChatId>;

export type GenieChat<T extends AnyTool> = {
  tool: T;
  id: ChatId;
  messages: GenieMessage<T>[];
};
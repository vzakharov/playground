import { AnyTool, AssetName, Branded, GenieMessage, GenieSchema, Leftovers, ToolName } from ".";

const $genieChatId = Symbol('$GenieChatId');
export type $GenieChatId = typeof $genieChatId;

export type ChatId = Branded<string, $GenieChatId>;

export type ChatData<T extends AnyTool> = {
  toolId: T['id'];
  id: ChatId;
  messages: GenieMessage<T>[];
  leftovers?: Leftovers<T>;
};
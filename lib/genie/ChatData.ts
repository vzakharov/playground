import { AnyTool, Branded, GenieMessage, Leftovers } from ".";

const $genieChatId = Symbol('$GenieChatId');
export type $GenieChatId = typeof $genieChatId;

export type ChatId = Branded<string, $GenieChatId>;

export type LeftoversDefined = boolean;

export type ChatData<T extends AnyTool, LD extends LeftoversDefined> = {
  toolId: T['id'];
  id: ChatId;
  messages: GenieMessage<T>[];
  // leftovers?: Leftovers<T>;
} & (
  LD extends true ? {
    leftovers: Leftovers<T>;
  } : {
    leftovers?: never;
  }
);
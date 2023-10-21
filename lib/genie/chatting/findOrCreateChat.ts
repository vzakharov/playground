import _ from "lodash";
import { ChatId, ChatData, GenieData, GenieSchema, ToolFrom, ToolName, Toolset, findBy } from "..";

export function findOrCreateChat<S extends Toolset, T extends ToolFrom<S>>(
  { chats }: GenieData<S>,
  tool: T,
  id: ChatId
) {
  const chat = _.find(chats, { tool, id }) as ChatData<T> | undefined;
  if (!chat) {
    const newChat: ChatData<T> = {
      tool,
      id,
      messages: []
    };
    chats.push(newChat);
    return newChat;
  }
  return chat;
}

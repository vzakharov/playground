import _ from "lodash";
import { ChatId, ChatData, GenieData, GenieSchema, ToolFrom, ToolName, Toolset, findBy } from "..";

export function findOrCreateChat<S extends Toolset, T extends ToolFrom<S>>(
  { chats }: GenieData<S>,
  { id: toolId }: T,
  id: ChatId
): ChatData<T, any> {
  const chat = findBy({ toolId, id }, chats);
  if (!chat) {
    const newChat = {
      toolId,
      id,
      messages: []
    };
    chats.push(newChat);
    return newChat;
  }
  return chat;
}

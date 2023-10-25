import { ChatData, ChatId, GlobalData, ToolFrom, Toolset, findBy } from "..";

export function findOrCreateChat<S extends Toolset, T extends ToolFrom<S>>(
  { chats }: GlobalData<S>,
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

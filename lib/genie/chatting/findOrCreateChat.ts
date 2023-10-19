import _ from "lodash";
import { ChatId, GenieChat, GenieData, GenieSchema, ToolFrom, ToolName, Toolset, findBy } from "..";

export function findOrCreateChat<S extends Toolset, T extends ToolFrom<S>>(
  { chats }: GenieData<S>,
  tool: T,
  id: ChatId
) {
  const chat = _.find(chats, { tool, id }) as GenieChat<T> | undefined;
  if (!chat) {
    const newChat: GenieChat<T> = {
      tool,
      id,
      messages: []
    };
    chats.push(newChat);
    return newChat;
  }
  return chat;
}

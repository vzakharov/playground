import _ from "lodash";
import { ChatId, GenieChat, GenieData, Schema, Tool, findBy } from "..";

export function findOrCreateChat<S extends Schema, T extends Tool<S>>(
  { chats }: GenieData<S>,
  tool: T,
  id: ChatId
) {
  const chat = _.find(chats, { tool, id }) as GenieChat<S, T> | undefined;
  if (!chat) {
    const newChat: GenieChat<S, T> = {
      tool,
      id,
      messages: []
    };
    chats.push(newChat);
    return newChat;
  }
  return chat;
}

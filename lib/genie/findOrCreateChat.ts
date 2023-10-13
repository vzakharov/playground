import _ from "lodash";
import { AssetName, ChatId, GenieChat, GenieChatType, findBy } from ".";
import { GenieData } from "./GenieData";

export function findOrCreateChat<Ts extends GenieChatType, T extends Ts>(
  { chats }: GenieData<Ts>,
  type: T,
  id: ChatId
) {
  const chat = findBy({ type, id }, chats);
  if (!chat) {
    const newChat: GenieChat<T, AssetName> = {
      type,
      id,
      messages: []
    };
    chats.push(newChat);
    return newChat;
  }
  return chat;
}

import _ from "lodash";
import { GenieChat, findBy } from ".";
import { GenieData } from "./GenieData";

export function findOrCreateChat<Ts extends string, T extends Ts>(
  { chats }: GenieData<Ts>,
  type: T,
  id: string
) {
  const chat = findBy({ type, id }, chats);
  if (!chat) {
    const newChat: GenieChat<T, string> = {
      type,
      messages: []
    };
    chats.push(newChat);
    return newChat;
  }
  return chat;
}

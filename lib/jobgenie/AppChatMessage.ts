import { ChatRole, ChatMessage as RawChatMessage, chatRoles, says as rawSays } from "~/lib/vovas-openai";
import { Assets, WithId, withUniqueId } from ".";
import { objectWithKeys } from "vovas-utils";
import { ChatType } from "./ChatType";


export type AppChatMessage<T extends ChatType, R extends ChatRole = ChatRole> =
  RawChatMessage<R> &
  WithId & {
    content: string;
    assets?: Assets<T>;
    assetsPickedAt?: number;
  };

export const says = objectWithKeys(chatRoles, role => <T extends ChatType>(content: string, params?: Omit<AppChatMessage<T>, 'id' | 'role' | 'content'>) => ({
  ...rawSays[role](content),
  ...params,
  ...withUniqueId()
})
) as {
    [K in ChatRole]: <T extends ChatType>(content: string, assets?: Assets<T>) => AppChatMessage<T, K>;
  };
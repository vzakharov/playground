import _ from "lodash";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { Inferrable } from "./utils";
import { objectWithKeys } from "vovas-utils";

export const chatRoles = ['user', 'assistant', 'system'] as const;

export type ChatRole = typeof chatRoles[number];

export type WithRole<R extends ChatRole = any> = { role: R };

export type ChatMessage<R extends ChatRole = ChatRole> = 
  WithRole<R>
  & {
    content: R extends 'assistant' ? string | null : string;
  }
  & Omit<ChatCompletionMessageParam, 'role' | 'content'>;

export function chatMessage<R extends ChatRole>(role: R, content: string): ChatMessage<R> {
  return {
    role, content
  };
}

export const says = objectWithKeys(chatRoles, role => 
  (content: string) => chatMessage(role, content)
) as {
  [K in ChatRole]: (content: string) => ChatMessage<K>;
};

export const isBy = objectWithKeys(chatRoles, role => 
  (message: WithRole) => message.role === role
) as {
  [R in ChatRole]: <M extends WithRole>(message: M) => message is M & WithRole<R>;
};

export const messagesBy = objectWithKeys(chatRoles, role => 
  (messages: WithRole[]) => messages.filter(isBy[role])
) as {
  [R in ChatRole]: <M extends WithRole>(messages: M[]) => (M & WithRole<R>)[];
};
import _ from "lodash";
import { ChatCompletionMessageParam } from "openai/resources/chat";

export const chatRoles = ['user', 'assistant', 'system'] as const;

export type ChatRole = typeof chatRoles[number];

// export type ChatMessage = ChatCompletionMessageParam;
export type ChatMessage<R extends ChatRole = ChatRole> = {
  role: R;
} & Omit<ChatCompletionMessageParam, 'role'>;

export function chatMessage<R extends ChatRole>(role: R, content: string): ChatMessage<R> {
  return {
    role, content
  };
}

export const says = _.values(chatRoles).reduce((acc, role) => ({
  ...acc,
  [role]: (content: string) => chatMessage(role, content),
}), {} as {
  [K in ChatRole]: (content: string) => ChatMessage<K>;
});

export const isBy = _.values(says).reduce((acc, fn) => ({
  ...acc,
  [fn.name]: (message: ChatMessage) => message.role === fn.name,
}), {} as {
  [R in ChatRole]: (message: ChatMessage) => message is ChatMessage<R>;
});
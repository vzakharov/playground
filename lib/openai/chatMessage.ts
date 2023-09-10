import _ from "lodash";
import { ChatCompletionMessageParam } from "openai/resources/chat";

export const chatRoles = ['user', 'assistant'] as const;

export type ChatRole = typeof chatRoles[number];

export type ChatMessage = ChatCompletionMessageParam;

export const chatMessage = (role: ChatRole, content: string): ChatMessage => ({
  role, content
});

export const chat = _.values(chatRoles).reduce((acc, role) => ({
  ...acc,
  [role]: (content: string) => chatMessage(role, content),
}), {} as Record<ChatRole, (content: string) => ChatMessage>);

import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { ai } from './ai';
import { PromptType, systemMessages } from './systemMessages';
import { chatCompletion } from '~/lib/vovas-openai';

export async function generateResponse(type: PromptType, messages: ChatCompletionMessageParam[]) {
  const [ response ] = await chatCompletion(buildPrompt(type, messages));
  return response;
}

export function buildPrompt(type: PromptType, messages: ChatCompletionMessageParam[]) {
  return [
    { role: 'system', content: systemMessages[type] } as const,
    ...messages
  ]
}
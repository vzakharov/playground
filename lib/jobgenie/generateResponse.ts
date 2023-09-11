import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { asIs, generate, shortestFirst } from '~/lib/vovas-openai';
import { PromptType, systemMessages } from './systemMessages';

export async function generateResponse(type: PromptType, messages: ChatCompletionMessageParam[]) {

  const { result } = await generate(
    buildPrompt(type, messages), {
      ...asIs, ...shortestFirst
    }
  );
  
  return result;

}

export function buildPrompt(type: PromptType, messages: ChatCompletionMessageParam[]) {
  return [
    { role: 'system', content: systemMessages[type] } as const,
    ...messages
  ]
}
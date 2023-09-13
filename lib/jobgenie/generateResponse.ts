import { ChatMessage, generate, shortestFirst } from '~/lib/vovas-openai';
import { PromptType, prompting } from './prompting';

export async function generateResponse(type: PromptType, messages: ChatMessage[]) {

  const { result } = await generate(
    [
      { role: 'system', content: prompting[type].systemMessage } as const,
      ...messages
    ], {
      model: 'gpt-4',
      pickFrom: 3,
      ...shortestFirst,
      throwIfNone: true,
    }
  );
  
  return result;

};
import { ChatMessage, generate, itselfOrIts, shortestFirst } from '~/lib/vovas-openai';
import { PromptType, prompting } from './prompting/prompting';

export async function generateResponse(type: PromptType, messages: ChatMessage[]) {

  const { result } = await generate(
    [
      { role: 'system', content: prompting[type].systemMessage } as const,
      ...messages
    ], {
      model: 'gpt-4',
      pickFrom: 3,
      ...shortestFirst,
      evaluate: result => itselfOrIts('leadIn')(result).length,
      throwIfNone: true,
      fn: prompting[type].fn,
    }
  );
  
  return result;

};
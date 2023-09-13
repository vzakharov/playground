import { ChatMessage, generate, globalUsageContainer, itselfOrIts, jsonChars, shortestFirst } from '~/lib/vovas-openai';
import { PromptType, prompting } from './prompting/prompting';
import { RefLike } from './utils';

export async function generateResponse(type: PromptType, messages: ChatMessage[], msExpected: RefLike<number | null>) {

  const promptMessages = [
    { role: 'system', content: prompting[type].systemMessage } as const,
    ...messages
  ];
  const fn = prompting[type].fn;
  const model = 'gpt-4';

  msExpected.value = (
    jsonChars(promptMessages, fn) * globalUsageContainer.msPerPromptJsonChar(model)
  ) || null;

  const { result } = await generate(promptMessages, 
    {
      model,
      pickFrom: 3,
      ...shortestFirst,
      evaluate: result => itselfOrIts('leadIn')(result).length,
      throwIfNone: true,
      fn,
    }
  );
  
  return result;

};
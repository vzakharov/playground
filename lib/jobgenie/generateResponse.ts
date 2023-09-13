import { ChatMessage, generate, globalUsageContainer, itselfOrIts, jsonChars, shortestFirst } from '~/lib/vovas-openai';
import { PromptType, prompting } from './prompting/prompting';
import { RefLike } from './utils';

export type GenerateResponseParams = {
  type: PromptType;
  messages: ChatMessage[];
  msExpected: RefLike<number | null>;
  useGpt4: RefLike<boolean>;
};

export async function generateResponse({ type, messages, msExpected, useGpt4 }: GenerateResponseParams) {

  const promptMessages = [
    { role: 'system', content: prompting[type].systemMessage } as const,
    ...messages
  ];
  const fn = prompting[type].fn;
  const model = useGpt4.value ? 'gpt-4' : 'gpt-3.5-turbo';

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
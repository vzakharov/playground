import { ChatMessage, generate, globalUsageContainer, itselfOrIts, jsonChars, shortestFirst } from '~/lib/vovas-openai';
import { PromptType, prompting } from './prompting/prompting';
import { RefLike } from './utils';
import { AppData } from './types';

export type GenerateResponseParams = {
  type: PromptType;
  messages: ChatMessage[];
  msExpected: RefLike<number | null>;
  useGpt4: RefLike<boolean>;
};

export async function generateResponse(
  { type, messages, msExpected, useGpt4 }: GenerateResponseParams,
  data: AppData
) {

  const promptingParams = prompting({ type, messages, data });
  const { systemMessage } = promptingParams;
  const fn = promptingParams.fn || undefined;
  const promptMessages = [
    { role: 'system', content: systemMessage } as const,
    ...messages
  ];
  const model = useGpt4.value ? 'gpt-4' : 'gpt-3.5-turbo';

  msExpected.value = (
    jsonChars(promptMessages, fn) * globalUsageContainer.msPerPromptJsonChar(model)
  ) || null;

  const { result } = await generate(promptMessages, 
    {
      model,
      pickFrom: 3,
      ...shortestFirst,
      evaluate: result => itselfOrIts('content')(result).length,
      throwIfNone: true,
      fn,
    }
  );
  
  return result;

};
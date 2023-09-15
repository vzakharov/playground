import { savedMsPerPromptJsonChar, usdSpent } from '~/components/jobgenie/refs';
import { generate, globalUsageContainer, itselfOrIts, reduceChatMessages, shortestFirst } from '~/lib/vovas-openai';
import { toRawMessage } from './toRawMessages';
import { AppChatMessage, AppData, ChatType, ContentAndAssets } from './types';
import { RefLike } from './utils';
import { is } from 'vovas-utils';
import { getPromptBuilder } from './prompting';

export type GenerateResponseParams<T extends ChatType> = {
  type: T;
  messages: AppChatMessage<T>[];
  msExpected: RefLike<number | null>;
  useGpt4: RefLike<boolean>;
};

export async function generateResponse<T extends ChatType>(
  { type, messages, msExpected, useGpt4 }: GenerateResponseParams<T>,
  data: AppData
) {
  const { promptMessages, fn } = getPromptBuilder(type).build({ type, messages, data });
  const model = useGpt4.value ? 'gpt-4' : 'gpt-3.5-turbo';

  const jsonChars = reduceChatMessages({ promptMessages });

  const msPerPromptJsonChar = 
    globalUsageContainer.msPerPromptJsonChar(model)
    || savedMsPerPromptJsonChar[model]
    || NaN;

  msExpected.value = (
    jsonChars * msPerPromptJsonChar
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

  savedMsPerPromptJsonChar[model] = globalUsageContainer.msPerPromptJsonChar(model);
  
  usdSpent.value += globalUsageContainer.cost.totalUsd;

  return {
    role: 'assistant' as const,
    ...is.string(result)
      ? { content: result }
      : (
        ({ content, ...assets }) => ({ content, assets }) as ContentAndAssets<T>
      )(result)
  }

};
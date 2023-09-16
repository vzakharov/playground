import { state } from '~/components/jobgenie/refs';
import { generate, globalUsageContainer, itselfOrIts, reduceChatMessages, shortestFirst } from '~/lib/vovas-openai';
import { toRawMessage } from './toRawMessages';
import { AppChatMessage, AppData, ChatType, ContentAndAssets } from './types';
import { RefLike } from './utils';
import { is } from 'vovas-utils';
import { getPromptBuilder } from './prompting';
import { State } from './state';

export type GenerateResponseParams<T extends ChatType> = {
  type: T,
  messages: AppChatMessage<T>[],
  msExpected: RefLike<number | null>;
  data: AppData
};

export async function generateResponse<T extends ChatType>(
  params: GenerateResponseParams<T>,
  state: State
) {
  const { type, messages, data, msExpected } = params;
  const { useGpt4, savedMsPerPromptJsonChar } = state;
  const { promptMessages, fn } = getPromptBuilder(type).build({ type, messages, data });
  const model = useGpt4 ? 'gpt-4' : 'gpt-3.5-turbo';

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
      evaluate: result => 
        // itselfOrIts('content')(result).length,
        is.string(result) ? result.length : result.content.length,
      throwIfNone: true,
      fn,
    }
  );

  state.savedMsPerPromptJsonChar[model] = globalUsageContainer.msPerPromptJsonChar(model);
  
  state.usdSpent += globalUsageContainer.cost.totalUsd;

  return {
    role: 'assistant' as const,
    ...is.string(result)
      ? { content: result }
      : (
        ({ content, ...assets }) => ({ content, assets }) as ContentAndAssets<T>
      )(result)
  }

};
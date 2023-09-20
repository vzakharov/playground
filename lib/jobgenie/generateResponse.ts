import { is, mutate } from 'vovas-utils';
import { generate, globalUsageContainer, itselfOrIts, reduceChatMessages, shortestFirst } from '~/lib/vovas-openai';
import { AppChatMessage } from "./AppChatMessage";
import { getPromptBuilder } from './prompting';
import { State } from './state';
import { AppData, ChatType } from './types';
import { RefLike, setValue, withUniqueId } from './utils';

export type GenerateResponseParams<T extends ChatType> = {
  type: T,
  messages: AppChatMessage<T>[],
  msExpected: RefLike<number | null>;
  data: AppData
};

export async function generateResponse<T extends ChatType>(
  params: GenerateResponseParams<T>,
  state: State
): Promise<AppChatMessage<T, 'assistant'>> {
  const { type, messages, data, msExpected } = params;
  const { useGpt4, savedMsPerPromptJsonChar } = state;
  const { promptMessages, fn } = getPromptBuilder(type).build({ type, messages, data });
  const model = useGpt4 ? 'gpt-4' : 'gpt-3.5-turbo';

  const jsonChars = reduceChatMessages({ promptMessages });

  const msPerPromptJsonChar = 
    globalUsageContainer.msPerPromptJsonChar(model)
    || savedMsPerPromptJsonChar[model]
    || NaN;

  setValue(
    msExpected, 
    (
      jsonChars * msPerPromptJsonChar
    ) || null
  );

  const { result, leftovers } = await generate(promptMessages, 
    {
      model,
      pickFrom: 3,
      ...shortestFirst,
      evaluate: result => 
        itselfOrIts('content')(result).length,
        // is.string(result) ? result.length : result.content.length,
      throwIfNone: true,
      fn,
    }
  );

  state.savedMsPerPromptJsonChar[model] = globalUsageContainer.msPerPromptJsonChar(model);
  state.usdSpent += globalUsageContainer.cost.totalUsd;

  const fromRawMessage = (raw: typeof result) => ({
    ...withUniqueId(),
    role: 'assistant' as const,
    ...is.string(raw)
      ? { content: raw }
      : (
        ({ content, ...assets }) => ({ content, assets })
      )(raw)
  }) as AppChatMessage<T, 'assistant'>;

  const responseMessage = fromRawMessage(result);

  mutate(state, { 
    leftovers: {
      results: leftovers.map(fromRawMessage),
      baseId: responseMessage.id,
      selectedIndex: 1
    }
  });

  return responseMessage

};
import { is, mutate } from 'vovas-utils';
import { generate, globalUsageContainer, itselfOrIts, reduceChatMessages, shortestFirst } from '~/lib/vovas-openai';
import { AppChatMessage } from "./AppChatMessage";
import { getPromptBuilder } from './prompting';
import { GlobalState } from './state';
import { AppData, ChatType } from './types';
import { RefLike, setValue, withUniqueId } from './utils';

export type GenerateResponseParams<T extends ChatType> = {
  type: T,
  messages: AppChatMessage<T>[],
  state: {
    msExpected: number | undefined
  },
  globalState: GlobalState,
  data: AppData
};

export async function generateResponse<T extends ChatType>(
  params: GenerateResponseParams<T>
): Promise<AppChatMessage<T, 'assistant'>> {
  const { type, messages, data, state, globalState } = params;
  const { useGpt4, savedMsPerPromptJsonChar } = globalState;
  const { promptMessages, fn } = getPromptBuilder(type).build({ type, messages, data });
  const model = useGpt4 ? 'gpt-4' : 'gpt-3.5-turbo';

  const jsonChars = reduceChatMessages({ promptMessages });

  const msPerPromptJsonChar = 
    globalUsageContainer.msPerPromptJsonChar(model)
    || savedMsPerPromptJsonChar[model]
    || NaN;

  state.msExpected = ( jsonChars * msPerPromptJsonChar ) || undefined;

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

  globalState.savedMsPerPromptJsonChar[model] = globalUsageContainer.msPerPromptJsonChar(model);
  globalState.usdSpent += globalUsageContainer.cost.totalUsd;

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

  mutate(globalState, { 
    leftovers: {
      results: leftovers.map(fromRawMessage),
      baseId: responseMessage.id,
      selectedIndex: 1
    }
  });

  return responseMessage

};
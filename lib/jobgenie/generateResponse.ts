import _ from 'lodash';
import { is, mutate } from 'vovas-utils';
import { generate, globalUsageContainer, itselfOrIts, reduceChatMessages, shortestFirst } from '~/lib/vovas-openai';
import { AppChatMessage } from "./AppChatMessage";
import { getPromptBuilder } from './prompting';
import { GlobalState, areLeftoversForMessage } from './state';
import { AppData, ChatType } from './types';
import { withUniqueId } from './utils';

export type GenerateResponseParams<T extends ChatType> = {
  type: T,
  messages: AppChatMessage<T>[],
  previousGeneration?: AppChatMessage<T, 'assistant'>,
  state: {
    msExpected: number | undefined
  },
  globalState: GlobalState,
  data: AppData
};

export async function generateResponse<T extends ChatType>(
  { type, messages, data, state, globalState, previousGeneration }: GenerateResponseParams<T>
): Promise<AppChatMessage<T, 'assistant'>> {
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
  const existingLeftovers = globalState.leftovers;

  mutate(globalState, { 
    leftovers: {
      results: _.compact([
        ...leftovers.map(fromRawMessage),
        // If the the existing leftovers are for the previousGeneration, then we want to keep them (as well as the previous generation itself)
        ...previousGeneration && areLeftoversForMessage(existingLeftovers, previousGeneration) ? [
          ...existingLeftovers.results,
          previousGeneration
        ] : []
      ]),
      baseId: responseMessage.id,
      selectedIndex: 1
    }
  });

  return responseMessage

};
import _ from 'lodash';
import { is, mutate } from 'vovas-utils';
import { UsageContainer, generate, globalUsageContainer, itselfOrIts, reduceChatMessages, shortestFirst } from '~/lib/vovas-openai';
import { JobGenieMessage } from "./JobGenieMessage";
import { getPromptBuilder } from './prompting';
import { GlobalState, temperatureForDescriptor } from './state';
import { areLeftoversForMessage, getLeftovers, setLeftovers } from "./leftovers";
import { AppData } from "./AppData";
import { ChatType } from "./ChatType";
import { withUniqueId } from '~/lib/genie';

export type GenerateResponseParams<T extends ChatType> = {
  type: T,
  messages: JobGenieMessage<T>[],
  previousGeneration?: JobGenieMessage<T, 'assistant'>,
  state: {
    msExpected: number | undefined
  },
  globalState: GlobalState,
  data: AppData
};

export async function generateResponse<T extends ChatType>(
  { type, messages, data, state, globalState, previousGeneration }: GenerateResponseParams<T>
): Promise<JobGenieMessage<T, 'assistant'>> {
  const { useGpt4, savedMsPerPromptJsonChar, temperatureDescriptor, openaiKey } = globalState;
  const { promptMessages, fn } = getPromptBuilder(type).build({ messages, data });
  const model = useGpt4 ? 'gpt-4' : 'gpt-3.5-turbo';

  const jsonChars = reduceChatMessages({ promptMessages });

  const msPerPromptJsonChar = 
    globalUsageContainer.msPerPromptJsonChar(model)
    || savedMsPerPromptJsonChar[model]
    || NaN;

  state.msExpected = ( jsonChars * msPerPromptJsonChar ) || undefined;
  const usageContainer = new UsageContainer();

  const { result, leftovers } = await generate(promptMessages, 
    {
      model,
      pickFrom: 3,
      apiKey: openaiKey,
      temperature: temperatureForDescriptor[temperatureDescriptor],
      ...shortestFirst,
      evaluate: result => 
        itselfOrIts('content')(result).length,
        // is.string(result) ? result.length : result.content.length,
      throwIfNone: true,
      fn,
      usageContainer
    }
  );

  globalState.savedMsPerPromptJsonChar[model] = globalUsageContainer.msPerPromptJsonChar(model);
  globalState.usdSpent += usageContainer.cost.totalUsd;

  const fromRawMessage = (raw: typeof result) => ({
    ...withUniqueId(),
    role: 'assistant' as const,
    ...is.string(raw)
      ? { content: raw }
      : (
        ({ content, ...assets }) => ({ content, assets })
      )(raw)
  }) as JobGenieMessage<T, 'assistant'>;

  const responseMessage = fromRawMessage(result);
  const existingLeftovers = getLeftovers(globalState, type);

  setLeftovers(globalState, type, {
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
  });

  return responseMessage

};
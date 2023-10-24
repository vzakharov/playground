import _ from 'lodash';
import { is } from 'vovas-utils';
import {
  ChatFunction,
  ChatFunctionReturns,
  UsageContainer, generate, globalUsageContainer, itselfOrIts, reduceChatMessages, shortestFirst
} from '~/lib/vovas-openai';
import {
  AnyTool,
  GenieMessage, Responder,
  Tool,
  temperatureForDescriptor, withUniqueId
} from '../..';
import { IsAny } from '~/lib/utils';

export async function generateResponse<
  T extends Tool<any, A, any>,
  A extends string
>(
  this: Responder<T>
): Promise<GenieMessage<T, 'assistant'>> {
  const { config: { tool, globalData, globalState, state }, messages, previousGeneration } = this;
  const { useGpt4, savedMsPerPromptJsonChar, temperatureDescriptor, openaiKey } = globalState;
  const { promptMessages, fn } = tool.build({ messages, globalData });
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
  }) as GenieMessage<S, T, 'assistant'>;

  const responseMessage = fromRawMessage(result);
  const existingLeftovers = this.leftovers;

  this.leftovers = {
    results: _.compact([
      ...leftovers.map(fromRawMessage),
      // If the the existing leftovers are for the previousGeneration, then we want to keep them (as well as the previous generation itself)
      ...previousGeneration && this.leftoversForMessage(previousGeneration) ? [
        ...existingLeftovers.results,
        previousGeneration
      ] : []
    ]),
    baseMessageId: responseMessage.id,
    activeMessageOriginalIndex: 1
  };

  return responseMessage

};
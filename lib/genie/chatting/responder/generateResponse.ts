import { is } from 'vovas-utils';
import { flatpact } from '~/lib/utils';
import { UsageContainer, generate, globalUsageContainer, reduceChatMessages, shortestFirst } from '~/lib/vovas-openai';
import { GenieMessage, GlobalData, GlobalState, Responder, Tool, temperatureForDescriptor, withUniqueId } from '../..';

export async function generateResponse<
  T extends Tool<any, A, any>,
  A extends string
>(
  this: Responder<T, any, GlobalState>
): Promise<GenieMessage<T, 'assistant'>> {
  const { 
    config: { tool, globalData, globalState, state }, 
    messages, previousGeneration,
    prompt: { promptMessages, fn}
  } = this;
  const { useGpt4, savedMsPerPromptJsonChar, temperatureDescriptor, openaiKey } = globalState;
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
        ({ replyMessage: content, ...assets }) => ({ content, assets })
      )(raw)
  }) as GenieMessage<T, 'assistant'>;

  const responseMessage = fromRawMessage(result);

  const existingLeftoverResults = 
    this.areLeftoversDefined() 
    && this.messageWithLeftovers === previousGeneration
    && this.data.leftovers.results;

  this.setLeftovers({
    results: flatpact([
      existingLeftoverResults,
      leftovers.map(fromRawMessage),
    ]),
    baseMessageId: responseMessage.id,
    activeMessageOriginalIndex: 1
  });

  return responseMessage

};
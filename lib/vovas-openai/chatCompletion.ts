import _ from 'lodash';
import { ChatCompletionCreateParams, ChatCompletionMessageParam } from 'openai/resources/chat';
import { $throw } from 'vovas-utils';
import { Model, UsageContainer } from '.';
import { openai } from './openai';

const { log } = console;

export type Conversation = [query: string, response: string][];

export type ChatCompletionOptions = {
  model?: Model;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stop?: string | string[];
  pickFrom?: number;
  apiKey?: string;
  usageContainer?: UsageContainer;
  functions?: ChatCompletionCreateParams.Function[];
};

export async function chatCompletion(
  messages: ChatCompletionMessageParam[],
  options?: ChatCompletionOptions,
) {

  // log.cyan({ messages, options });

  const { 
    model = 'gpt-3.5-turbo', temperature, maxTokens, topP, stop, pickFrom = 1, apiKey, usageContainer, functions
  } = options ?? {};

  const {
    choices, usage,
  } = await openai().chat.completions.create({
    model,
    messages,
    functions,
    ..._.pickBy(
      {
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        stop,
        n: pickFrom,
      },
      _.identity,
    ),
  });

  // log.green({ choices, usage });

  usage && usageContainer?.addUsage(usage, model);

  const contents = choices.map(
    ({ message }) =>
      (message ?? $throw(`No message in response: ${JSON.stringify(choices)}`))
        .content ??
      $throw(`No content in response message: ${JSON.stringify(message)}`),
  );

  return contents;
    
}
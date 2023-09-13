import _ from 'lodash';
import { ChatCompletionChunk, ChatCompletionMessageParam } from 'openai/resources/chat';
import { $throw, camelize } from 'vovas-utils';
import { AnyChatFunction, ChatFunction, ChatFunctionReturns, Model, UsageContainer } from '.';
import { openai } from './openai';

const { log } = console;

export type Conversation = [query: string, response: string][];

export type ChatCompletionOptions<Fn extends AnyChatFunction> = {
  model?: Model;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stop?: string | string[];
  pickFrom?: number;
  apiKey?: string;
  usageContainer?: UsageContainer;
  fn: Fn;
};

export type ChatCompletionResultItem<Fn extends AnyChatFunction> =
  Fn extends AnyChatFunction 
    ? string | ChatFunctionReturns<Fn> 
    : string;

export async function chatCompletion<Fn extends AnyChatFunction>(
  messages: ChatCompletionMessageParam[],
  options?: ChatCompletionOptions<Fn>,
): Promise<ChatCompletionResultItem<Fn>[]> {

  const time = Date.now();

  const { 
    model = 'gpt-3.5-turbo', temperature, maxTokens, topP, stop, pickFrom = 1, 
    apiKey, usageContainer, fn
  } = options ?? {};

  const functions = fn ? [fn] : undefined;

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

  usage && usageContainer?.addUsage(model, {
    ...camelize(usage),
    promptJsonChars: JSON.stringify([ messages, functions ]).length,
    msTaken: { [model]: Date.now() - time },
  });

  const results = choices.map(
    ({ message }) => {
      // return (message ?? $throw(`No message in response: ${JSON.stringify(choices)}`))
      //   .content ??
      //   $throw(`No content in response message: ${JSON.stringify(message)}`);
      if ( !message ) throw new Error(`No message in response: ${JSON.stringify(choices)}`);
      const { content, function_call: functionCall } = message;
      if ( content ) return content;
      if ( !functionCall ) throw new Error(`No content or function_call in response message: ${JSON.stringify(message)}`);
      return JSON.parse(functionCall.arguments) as ChatFunctionReturns<Fn>;
    },
  ) as ChatCompletionResultItem<Fn>[];

  return results;
    
}
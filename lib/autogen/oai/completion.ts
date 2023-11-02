import { RateLimitError, BadRequestError, APIConnectionTimeoutError, AuthenticationError } from 'openai';
import { $throw, Maybe, Message, isAmong, isSubclass } from "..";

export type CompletionConfig = {
  maxRetryPeriod?: number;
  seed?: number;
  prompt?: string;
  messages?: Message[];
  model?: string;
  // TODO: change to actual model type
  // tbd
};

export type CompletionContext = Record<string, any>;
// tbd

export type CompletionResponse = {
  // tbd
  cost: number;
  configId: number;
  passFilter: boolean;
} | -1;

export class Completion {

  /**
   * Set of models that support chat completion.
   */
  static chatModels = [
    'gpt-3.5-turbo', 
    'gpt-3.5-turbo-0301', // deprecate in Sep
    'gpt-3.5-turbo-0613', 'gpt-3.5-turbo-16k', 
    'gpt-3.5-turbo-16k-0613', 'gpt-35-turbo', 'gpt-35-turbo-16k', 'gpt-4', 'gpt-4-32k',
    'gpt-4-32k-0314', 'gpt-4-0314', // deprecate in Sep
    'gpt-4-0613', 'gpt-4-32k-0613'
  ] as const;

  static seed = 41;
  static cachePath = `.cache/${this.seed}`;
  // retry after this many seconds
  static retryWaitTime = 10;
  // fail a request after hitting RateLimitError for this many seconds
  static maxRetryPeriod = 120;
  // time out for request to openai server
  static requestTimeout = 60;

  static totalCost = 0;
  static optimizationBudget = undefined as number | undefined;

  public static create(
    { 
      context = undefined as CompletionContext | undefined, 
      useCache = true, 
      configList = undefined as CompletionConfig[] | undefined,
      filterFunc = undefined as ((
        context: Maybe<CompletionContext>, config: CompletionConfig, response: CompletionResponse
      ) => boolean) | undefined,
      raiseOnRatelimitOrTimeout = true, 
      allowFormatStrTemplate = false, 
      config = {} as CompletionConfig,
    } = {}  ): CompletionResponse {

    // Warn if a config list was provided but was empty
    if ( configList?.length === 0) {
      console.warn(
        "Completion was provided with a configList, but the list was empty. Adopting default OpenAI behavior, which reads from the 'model' parameter instead."
      );
    }

    if (configList) {
      const lastIndex = configList.length - 1;
      let cost = 0;
      for (let i = 0; i < configList.length; i++) {
        const eachConfig = configList[i];
        const baseConfig = { allowFormatStrTemplate, ...config };
        Object.assign(baseConfig, eachConfig);
        if (i < lastIndex && !filterFunc && !baseConfig.maxRetryPeriod) {
          baseConfig.maxRetryPeriod = 0;
        }
        try {
          const response = this.create({ 
            context, 
            useCache, 
            raiseOnRatelimitOrTimeout: i < lastIndex || raiseOnRatelimitOrTimeout, 
            config: baseConfig 
          });
          if (response === -1) {
            return response;
          }
          const passFilter = !filterFunc || filterFunc(context, baseConfig, response);
          if (passFilter || i === lastIndex) {
            return {
              ...response,
              cost: cost + response.cost,
              configId: i,
              passFilter
            };
          }
          cost += response.cost;
        } catch (error) {
          if (
            error instanceof AuthenticationError ||
            error instanceof RateLimitError ||
            error instanceof APIConnectionTimeoutError ||
            error instanceof BadRequestError
          ) {
            console.debug(`failed with config ${i}`, error);
            if (i === lastIndex) {
              throw error;
            }
          }
        }
      }
    }

    const params = this.constructParams(context, config, { allowFormatStrTemplate });
    if (!useCache) {
      return this.getResponse(params, { 
        raiseOnRatelimitOrTimeout, 
        useCache: false 
      });
    }
    const { seed } = this;
    if (params.seed) {
      this.setCache(params.seed);
      delete params.seed;
    }
    this.setCache(seed);
    return this.getResponse(params, { raiseOnRatelimitOrTimeout });
  };

  private static constructParams(
    context: Maybe<CompletionContext>,
    config: CompletionConfig, {
      prompt,
      messages,
      model,
      allowFormatStrTemplate = false,
    } = { ...config }
  ) {
    const params = { ...config };
    const isChatModel = isAmong(this.chatModels, model) || isSubclass(this, ChatCompletion);
    const instantiate = (content: string) =>
      this.instantiate(content, { context, allowFormatStrTemplate });
    // either "prompt" should be in config (for being compatible with non-chat models)
    // or "messages" should be in config (for tuning chat models only)
    if ( 
      !prompt && isChatModel
    ) {
      if ( !messages ) {
        throw new Error("Either prompt or messages should be in config for chat models.");
      }
    };
    if ( !prompt ) {
      params.messages =
        context
          ? messages?.map(m =>
            m.content
              ? { ...m, content: instantiate(m.content) }
              : m
          )
          : messages;
    } else if ( isChatModel ) {
      // convert prompt to messages
      params.messages = [
        {
          role: "user",
          content: instantiate(prompt),
        },
      ];
      delete params.prompt;
    } else {
      params.prompt = instantiate(prompt);
    };
    return params;
  };

  private static getResponse(
    params: CompletionConfig, {
      raiseOnRatelimitOrTimeout = false,
      useCache = true
    } = {}
  ): CompletionResponse {
    throw new Error("Method not implemented.");
  };

  static instantiate(template: string | ( ( context: CompletionContext ) => string ) | null, {
    context = undefined as CompletionContext | undefined,
    allowFormatStrTemplate = false 
  } = {}) {
    if ( !context || template === null ) {
      return typeof template === "string" ? template :
        $throw("Callable template requires context.");
    };
    if ( typeof template === "string" ) {
      return allowFormatStrTemplate 
        ? template.replaceAll(/{\w+}/g, match => context[match.slice(1, -1)] ?? match)
        : template;
    };
    return template(context);
    // Porting note: The original python code's typings do not allow template to be a function, we changed that here.
  };

  private static setCache(seed: number): void {
    throw new Error("Method not implemented.");
  };

};


export class ChatCompletion extends Completion {
  private static hello = "world"
  // tbd
}
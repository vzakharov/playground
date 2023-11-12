import OpenAI, { RateLimitError, BadRequestError, APIConnectionTimeoutError, AuthenticationError } from 'openai';
import { $throw, Maybe, Message, getKey, isAmong, isSubclass, pop } from "..";
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat';
import { CompletionCreateParamsNonStreaming } from 'openai/resources';

export type OaiCompletionsClass = typeof OpenAI.Completions;
export type OaiChatCompletionsClass = typeof OpenAI.Chat.Completions;

export type CompletionParams<
  ChatBased extends boolean
> = ChatBased extends true ? ChatCompletionCreateParamsNonStreaming : CompletionCreateParamsNonStreaming;

export type CompletionEngine<
  ChatBased extends boolean,
  Client extends { apiKey: string },
  Params extends CompletionParams<ChatBased>,
  Response extends {}
> = {
  models: readonly Params['model'][];
  isChatBased: ChatBased;
  creator: CompletionCreator<ChatBased, Client, Params, Response>;
};

export function asCompletionEngine<
  ChatBased extends boolean,
  Client extends { apiKey: string },
  Params extends CompletionParams<ChatBased>,
  Response extends {}
>(engine: CompletionEngine<ChatBased, Client, Params, Response>) {
  return engine;
};
// (A hack to automatically infer the generic types of CompletionEngine from the arguments of asCompletionEngine)

export const oaiChatCompletions = asCompletionEngine({
  models: [
    'gpt-4', 'gpt-4-0314', 'gpt-4-0613', 'gpt-4-32k', 'gpt-4-32k-0314', 'gpt-4-32k-0613', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-3.5-turbo-0301', 'gpt-3.5-turbo-0613', 'gpt-3.5-turbo-16k-0613'
  ] as const,
  // TODO: Update following latest OpenAI release
  isChatBased: true,
  creator: OpenAI.Chat.Completions
});

export const oaiCompletions = asCompletionEngine({
  models: [
    'babbage-002', 'davinci-002', 'text-davinci-003', 'text-davinci-002', 'text-davinci-001', 'code-davinci-002', 'text-curie-001', 'text-babbage-001', 'text-ada-001'
  ] as const,
  isChatBased: false,
  creator: OpenAI.Completions
});


export type GenericCompletionConfig<
  ChatBased extends boolean,
  Client extends { apiKey: string },
  Params extends CompletionParams<ChatBased>,
  Response extends {}
> = {
  engine: CompletionEngine<ChatBased, Client, Params, Response>;
  maxRetryPeriod?: number;
  requestTimeout?: number;
  retryWaitTime?: number;
  seed?: number;
  prompt?: ChatBased extends true ? never : string;
  messages?: ChatBased extends true ? Message[] : never;
  model?: Params['model'];
  params?: Omit<Params, 'model' | 'prompt' | 'messages'>;
  apiKeyPath?: string;
  context?: CompletionContext;
  useCache?: boolean;
  configList?: CompletionConfig<ChatBased, Client, Params, Response>[];
  filterFunc?: ((
    context: Maybe<CompletionContext>, config: CompletionConfig<ChatBased, Client, Params, Response>, response: CompletionResponse
  ) => boolean);
  raiseOnRatelimitOrTimeout?: boolean;
  allowFormatStrTemplate?: boolean;
};

export type ChatCompletionConfig<
  Client extends { apiKey: string },
  Params extends CompletionParams<true>,
  Response extends {}
> = GenericCompletionConfig<true, Client, Params, Response>;

export type NonChatCompletionConfig<
  Client extends { apiKey: string },
  Params extends CompletionParams<false>,
  Response extends {}
> = GenericCompletionConfig<false, Client, Params, Response>;

export type CompletionConfig<
  Client extends { apiKey: string },
  Params extends CompletionParams<boolean>,
  Response extends {}
> = ChatBased extends true ? ChatCompletionConfig<Client, Params, Response> : NonChatCompletionConfig<Client, Params, Response>;

export function isChatBased<
  ChatBased extends boolean,
  Client extends { apiKey: string },
  Params extends CompletionParams<ChatBased>,
  Response extends {},
>(config: CompletionConfig<ChatBased, Client, Params, Response>): config is CompletionConfig<true, Client, CompletionParams<true>, Response> {
  return config.engine.isChatBased;
};

export type CompletionContext = Record<string, any>;
// tbd

export type CompletionResponse = -1 | {
  // tbd
  cost: number;
  configId: number;
  passFilter: boolean;
};

export abstract class Completion<
  ChatBased extends boolean,
  Client extends { apiKey: string },
  Params extends CompletionParams<ChatBased>,
  Response extends {}
> {

  // /**
  //  * Set of models that support chat completion.
  //  */
  // chatModels = [
  //   'gpt-3.5-turbo', 
  //   'gpt-3.5-turbo-0301', // deprecate in Sep
  //   'gpt-3.5-turbo-0613', 'gpt-3.5-turbo-16k', 
  //   'gpt-3.5-turbo-16k-0613', 'gpt-35-turbo', 'gpt-35-turbo-16k', 'gpt-4', 'gpt-4-32k',
  //   'gpt-4-32k-0314', 'gpt-4-0314', // deprecate in Sep
  //   'gpt-4-0613', 'gpt-4-32k-0613'
  // ] as const;

  seed = 41;
  cachePath = `.cache/${this.seed}`;
  // retry after this many seconds
  retryWaitTime = 10;
  // fail a request after hitting RateLimitError for this many seconds
  maxRetryPeriod = 120;
  // time out for request to openai server
  requestTimeout = 60;

  totalCost = 0;
  optimizationBudget = undefined as number | undefined;

  // public static create(
  //   { 
  //     context = undefined as CompletionContext | undefined, 
  //     useCache = true, 
  //     configList = undefined as CompletionConfig[] | undefined,
  //     filterFunc = undefined as ((
  //       context: Maybe<CompletionContext>, config: CompletionConfig, response: CompletionResponse
  //     ) => boolean) | undefined,
  //     raiseOnRatelimitOrTimeout = true, 
  //     allowFormatStrTemplate = false, 
  //     config = {} as CompletionConfig,
  //   } = {}  ): CompletionResponse {
  constructor(
    public config: CompletionConfig<ChatBased, Client, Params, Response>
  ) { };

  async create(
    this: Completion<ChatBased, Client, Params, Response>,
    modifiedConfig: CompletionConfig<ChatBased, Client, Params, Response>
  ): Promise<CompletionResponse> {

    const { 
      context, useCache = true, configList, filterFunc, raiseOnRatelimitOrTimeout = true, allowFormatStrTemplate, ...config 
    } = {
      ...this.config,
      ...modifiedConfig
    };

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
          const response = await this.create({ 
            context, 
            useCache, 
            raiseOnRatelimitOrTimeout: i < lastIndex || raiseOnRatelimitOrTimeout, 
            ...baseConfig 
          });
          if (response == -1) {
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

  constructParams(
    context: Maybe<CompletionContext>,
    config: CompletionConfig<ChatBased, Client, Params, Response>, {
      prompt,
      messages,
      model,
      allowFormatStrTemplate = false,
    } = { ...config }
  ) {
    if ( isChatBased(config) ) {
    const { engine: { isChatBased } } = this.config;
    const { params } = config;
    const instantiate = (content: string) =>
      this.instantiate(content, { context, allowFormatStrTemplate });
    // either "prompt" should be in config (for being compatible with non-chat models)
    // or "messages" should be in config (for tuning chat models only)
    if ( 
      !prompt && isChatBased
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
    } else if ( isChatBased ) {
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

  // @classmethod
  // def _get_response(cls, config: Dict, raise_on_ratelimit_or_timeout=False, use_cache=True):
  //     """Get the response from the openai api call.

  //     Try cache first. If not found, call the openai api. If the api call fails, retry after retry_wait_time.
  //     """
  //     config = config.copy()
  //     openai.api_key_path = config.pop("api_key_path", openai.api_key_path)
  //     key = get_key(config)
  //     if use_cache:
  //         response = cls._cache.get(key, None)
  //         if response is not None and (response != -1 or not raise_on_ratelimit_or_timeout):
  //             # print("using cached response")
  //             cls._book_keeping(config, response)
  //             return response
  //     openai_completion = (
  //         openai.ChatCompletion
  //         if config["model"].replace("gpt-35-turbo", "gpt-3.5-turbo") in cls.chat_models
  //         or issubclass(cls, ChatCompletion)
  //         else openai.Completion
  //     )
  //     start_time = time.time()
  //     request_timeout = cls.request_timeout
  //     max_retry_period = config.pop("max_retry_period", cls.max_retry_period)
  //     retry_wait_time = config.pop("retry_wait_time", cls.retry_wait_time)
  //     while True:
  //         try:
  //             if "request_timeout" in config:
  //                 response = openai_completion.create(**config)
  //             else:
  //                 response = openai_completion.create(request_timeout=request_timeout, **config)
  //         except (
  //             ServiceUnavailableError,
  //             APIConnectionError,
  //         ):
  //             # transient error
  //             logger.info(f"retrying in {retry_wait_time} seconds...", exc_info=1)
  //             sleep(retry_wait_time)
  //         except APIError as err:
  //             error_code = err and err.json_body and isinstance(err.json_body, dict) and err.json_body.get("error")
  //             error_code = error_code and error_code.get("code")
  //             if error_code == "content_filter":
  //                 raise
  //             # transient error
  //             logger.info(f"retrying in {retry_wait_time} seconds...", exc_info=1)
  //             sleep(retry_wait_time)
  //         except (RateLimitError, Timeout) as err:
  //             time_left = max_retry_period - (time.time() - start_time + retry_wait_time)
  //             if (
  //                 time_left > 0
  //                 and isinstance(err, RateLimitError)
  //                 or time_left > request_timeout
  //                 and isinstance(err, Timeout)
  //                 and "request_timeout" not in config
  //             ):
  //                 if isinstance(err, Timeout):
  //                     request_timeout <<= 1
  //                 request_timeout = min(request_timeout, time_left)
  //                 logger.info(f"retrying in {retry_wait_time} seconds...", exc_info=1)
  //                 sleep(retry_wait_time)
  //             elif raise_on_ratelimit_or_timeout:
  //                 raise
  //             else:
  //                 response = -1
  //                 if use_cache and isinstance(err, Timeout):
  //                     cls._cache.set(key, response)
  //                 logger.warning(
  //                     f"Failed to get response from openai api due to getting RateLimitError or Timeout for {max_retry_period} seconds."
  //                 )
  //                 return response
  //         except InvalidRequestError:
  //             if "azure" in config.get("api_type", openai.api_type) and "model" in config:
  //                 # azure api uses "engine" instead of "model"
  //                 config["engine"] = config.pop("model").replace("gpt-3.5-turbo", "gpt-35-turbo")
  //             else:
  //                 raise
  //         else:
  //             if use_cache:
  //                 cls._cache.set(key, response)
  //             cls._book_keeping(config, response)
  //             return response
  /**
   * Try cache first. If not found, call the openai api. If the api call fails, retry after retry_wait_time.
   */
  private async getResponse(
    config: CompletionConfig<Client, Params, Response>, {
      raiseOnRatelimitOrTimeout = false,
      useCache = true
    } = {}
  ) {
    config = { ...config };
    const apiKeyPath = pop(config, "apiKeyPath") ?? process.env.API_KEY_PATH ?? "API_KEY";
    // Porting note: The original python code uses openai.api_key_path, which seems to not be a thing in the JS version, so we’re grabbing the value from the environment instead.
    const apiKey = process.env[apiKeyPath] ?? $throw(`API key not found at ${apiKeyPath}`);
    const configKey = getKey(config);
    if ( useCache ) {
      const response = this.cache.get(configKey);
      if ( response && ( response !== -1 || !raiseOnRatelimitOrTimeout ) ) {
        this.bookKeeping(config, response);
        return response;
      };
    };
    // const client = new OpenAI({ apiKey });
    const client = new this.engine.creator({ apiKey } as Client);
    // const OaiCompletionsClass = 
    //   isAmong(this.chatModels, config.model?.replace("gpt-35-turbo", "gpt-3.5-turbo")) 
    //   || this instanceof ChatCompletion
    //     ? OaiChatCompletions
    //     : OaiCompletions;
    // const oaiCompletions = new OaiCompletionsClass(client);
    // const oaiCreateCompletion = oaiCompletions.create.bind(oaiCompletions);
    const startTime = Date.now();
    const { params = {}, requestTimeout, maxRetryPeriod, retryWaitTime } = {
      ...this.config,
      ...config
    };
    while ( true ) {
      try {
        // const response = await oaiCreateCompletion({
        //   ...config,
        //   ...( requestTimeout ? { requestTimeout } : {} )
        // });
        const response = await client.create({
          model,
          ...params
        });
        if ( useCache ) {
          this.cache.set(configKey, response);
        };
        this.bookKeeping(config, response);
        return response;
      }


  };

  instantiate(template: string | ( ( context: CompletionContext ) => string ) | null, {
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

  private setCache(seed: number): void {
    throw new Error("Method not implemented.");
  };

};


export class ChatCompletion extends Completion {
  // tbd
}
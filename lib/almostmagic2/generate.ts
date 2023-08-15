import yaml, { YAMLException } from "js-yaml";
import { Configuration, OpenAIApi } from "openai";
import { $throw, mutate } from "vovas-utils";
import { GenerateMeta } from "./GenerateMeta";
import { GenerateOptions } from "./GenerateOptions";
import { composeChatPrompt } from "./composeChatPrompt";
import { Inputs } from "./specs/Inputs";
import { Specs } from "./specs/Specs";
import { matchesSpecs } from "./specs/matchesSpecs";
import { GenerateException } from "./GenerateException";

export const defaultMeta = new GenerateMeta();

export async function generate<O extends Specs, I extends Inputs>(
  outputSpecs: O,
  inputs?: I,
  options?: GenerateOptions<O, I>
) {

  const { openaiApiKey, examples, description, meta = defaultMeta, ...openaiOptions } = options ?? {};

  const openai = new OpenAIApi(new Configuration({ apiKey:
    options?.openaiApiKey ??
    process.env.OPENAI_API_KEY ??
    $throw('OpenAI API key is required either as `options.openaiApiKey` or as `process.env.OPENAI_API_KEY`')
  }));

  const messages = composeChatPrompt(outputSpecs, inputs, { examples, description });

  console.log({ messages });

  const requestData = {
    model: 'gpt-3.5-turbo',
    ...openaiOptions,
    messages
  };

  const response = await openai.createChatCompletion(requestData);

  const { data: { choices: [{ message }] }} = response;

  const { content } = message ?? {};

  mutate(meta, { api: { requestData, response } });

  try {
    const result = yaml.load(content ?? '');
    if ( matchesSpecs(result, outputSpecs) ) {
      return result
    };
    return new GenerateException('specMismatch', { result, outputSpecs });
  } catch ( error ) {
    console.log(content);
    console.error(error);
    return error instanceof YAMLException
      ? new GenerateException('yamlError', error)
      : Promise.reject(error);
  };

};

export const generateOrThrow = < O extends Specs, I extends Inputs >(
  ...args: Parameters<typeof generate<O, I>>
) => generate<O, I>(...args).then(result =>
  result instanceof Error
    ? $throw(result)
    : result
);
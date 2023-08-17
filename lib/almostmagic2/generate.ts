import yaml, { YAMLException } from "js-yaml";
import { Configuration, OpenAIApi } from "openai";
import { $throw, mutate } from "vovas-utils";
import { GenerateMeta } from "./GenerateMeta";
import { GenerateOptions } from "./GenerateOptions";
import { composeChatPrompt } from "./composeChatPrompt";
import { Inputs } from "./specs/Inputs";
import { Specs } from "./specs/Specs";
import { assertOutputMatchesSpecs, outputMatchesSpecs } from "./specs/outputMatchesSpecs";
import { GenerateException } from "./GenerateException";

export const defaultMeta = new GenerateMeta();

export async function generateOrThrow<O extends Specs, I extends Inputs>(
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

  const messages = composeChatPrompt(
    outputSpecs, 
    inputs, 
    { examples, description }
  );

  console.log(yaml.dump({ messages }));

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
    let result = yaml.load(content ?? '') as any;
    if ( typeof outputSpecs === 'string' ) 
      result = result['output'];
    assertOutputMatchesSpecs(result, outputSpecs);
    return result;
  } catch ( error ) {
    if ( error instanceof YAMLException )
      throw new GenerateException('yamlError', { content, ...error });
    throw error;
  };

};

export const generate = async < O extends Specs, I extends Inputs >(
  ...args: Parameters<typeof generateOrThrow<O, I>>
) => {
  try {
    return await generateOrThrow<O, I>(...args);
  } catch ( error ) {
    if ( error instanceof GenerateException )
      return error;
    throw error;
  };
}
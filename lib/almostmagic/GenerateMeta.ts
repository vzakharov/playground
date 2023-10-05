// import { OpenAIApi } from "openai";
import { ChatCompletion, ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat";
import { GenerateException, GenerateExceptionType } from ".";

// export type ChatCompletionMethod = OpenAIApi["createCompletion"];

export class GenerateMeta {
  api?: {
    // requestData?: Parameters<ChatCompletionMethod>[0];
    // response?: Awaited<ReturnType<ChatCompletionMethod>>;
    requestData?: ChatCompletionCreateParamsNonStreaming;
    response?: ChatCompletion;
  }
  error?: GenerateException<GenerateExceptionType>;
};
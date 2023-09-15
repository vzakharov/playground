import { NestedArray, messagesBy, says, stackUp } from "~/lib/vovas-openai";
import { ChatFunctionFor, PromptBuilderInput } from "./prompting";
import { AppData, ChatType, toRawMessage } from "~/lib/jobgenie";


export type PromptBuilderConfig<T extends ChatType> = {
  mainSystemMessage: string;
  requestFunctionCallAfter: number;
  buildSystemMessage: (params: PromptBuilderInput<T> & { 
    isFirstResponse: boolean; 
    requestFunctionCall: boolean;
  }) => NestedArray<string>;
  fn: ChatFunctionFor<T>;
};

export class PromptBuilder<T extends ChatType> {

  constructor(
    public type: T,
    public config: PromptBuilderConfig<T>
  ) { }

  build(input: PromptBuilderInput<T>) {

    const { messages } = input;
    const { mainSystemMessage, requestFunctionCallAfter, buildSystemMessage, fn } = this.config;

    const numResponses = messagesBy.assistant(messages).length;
    const isFirstResponse = numResponses === 0;
    const requestFunctionCall = numResponses > requestFunctionCallAfter;

    const systemMessage = buildSystemMessage({ isFirstResponse, requestFunctionCall, ...input });

    return {
      promptMessages: [
        says.system(
          stackUp([
            mainSystemMessage,
            systemMessage
          ])
        ),
        ...messages.map(toRawMessage<T>(fn))
      ],
      fn
    };
  }

};

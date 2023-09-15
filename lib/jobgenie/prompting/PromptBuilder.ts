import { ChatFunction, NestedArray, SimplifiedChatFunction, SimplifiedChatFunctionFor, chatFunction, messagesBy, says, stackUp } from "~/lib/vovas-openai";
import { ChatFunctionFor, FnPropsFor, PromptBuilderInput } from "./prompting";
import { AppData, AssetsMap, ChatType, StringKeys, toRawMessage } from "~/lib/jobgenie";


export type PromptBuilderConfig<T extends ChatType> = {
  mainSystemMessage: string;
  requestFunctionCallAfter: number;
  buildSystemMessage: (params: PromptBuilderInput<T> & { 
    isFirstResponse: boolean; 
    requestFunctionCall: boolean;
  }) => NestedArray<string>;
  fnArgs: SimplifiedChatFunction<string, FnPropsFor<T>, never>
};

export class PromptBuilder<T extends ChatType, FnName extends string, FnProps extends FnPropsFor<T>> {

  constructor(
    public type: T,
    public config: PromptBuilderConfig<T>
  ) { }

  build(input: PromptBuilderInput<T>) {

    const { messages } = input;
    const { mainSystemMessage, requestFunctionCallAfter, buildSystemMessage, fnArgs } = this.config;

    const fn = chatFunction(...fnArgs);

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
        ...messages.map(toRawMessage(fn))
      ],
      fn: requestFunctionCall ? fn : undefined
    };
  }

};

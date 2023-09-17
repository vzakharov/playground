import { ChatFunction, NestedArrayable, SimplifiedChatFunction, SimplifiedChatFunctionFor, StackUpable, chatFunction, messagesBy, says, stackUp } from "~/lib/vovas-openai";
import { ChatFunctionFor, FnPropsFor, PromptBuilderInput } from "./prompting";
import { AppData, AssetsMap, ChatType, StringKeys, toRawMessage } from "~/lib/jobgenie";


export type PromptBuilderConfig<T extends ChatType> = {
  mainSystemMessage: string;
  requestFunctionCallAfter: number;
  buildSystemMessages: (params: PromptBuilderInput<T> & { 
    isFirstResponse: boolean; 
    requestFunctionCall: boolean;
  }) => Record<'pre' | 'post', StackUpable>;
  fnArgs: SimplifiedChatFunction<string, FnPropsFor<T>, never>
};

export class PromptBuilder<T extends ChatType> {

  constructor(
    public type: T,
    public config: PromptBuilderConfig<T>
  ) { }

  build(input: PromptBuilderInput<T>) {

    const { messages } = input;
    const { mainSystemMessage, requestFunctionCallAfter, buildSystemMessages, fnArgs } = this.config;

    const fn = chatFunction(...fnArgs);

    const numResponses = messagesBy.assistant(messages).length;
    const isFirstResponse = numResponses === 0;
    const requestFunctionCall = numResponses > requestFunctionCallAfter;

    const { 
      pre: preMessage, 
      post: postMessage 
    } = buildSystemMessages({ isFirstResponse, requestFunctionCall, ...input });

    return {
      promptMessages: [
        says.system(
          stackUp([
            mainSystemMessage,
            preMessage
          ])
        ),
        ...messages.map(toRawMessage(fn)),
        says.system(stackUp(postMessage))
      ],
      fn: requestFunctionCall ? fn : undefined
    };
  }

};

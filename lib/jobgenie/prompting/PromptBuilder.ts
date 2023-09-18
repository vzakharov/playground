import { AppChatMessage, AppData, Assets, ChatType, toRawMessage } from "~/lib/jobgenie";
import { SimplifiedChatFunction, StackUpable, chatFunction, messagesBy, says, stackUp } from "~/lib/vovas-openai";
import { FnPropsFor } from "./prompting";


export type PromptBuilderConfig<T extends ChatType, A extends ChatType[] | null> = {
  mainSystemMessage: string;
  requestFunctionCallAfter: number;
  buildSystemMessages: (params: PromptBuilderInput<T, A> & { 
    isFirstResponse: boolean; 
    requestFunctionCall: boolean;
  }) => Record<'pre' | 'post', StackUpable>;
  fnArgs: SimplifiedChatFunction<string, FnPropsFor<T>, never>
  requiredAssets?: A;
};

export type PromptBuilderInput<T extends ChatType, A extends ChatType[] | null> = {
  type: T;
  messages: AppChatMessage<T>[];
  data: A extends ChatType[] ? AppData & { assets: Assets<A[number]> } : AppData;
};

export class PromptBuilder<T extends ChatType, A extends ChatType[] | null> {

  constructor(
    public type: T,
    public config: PromptBuilderConfig<T, A>
) { }

  build(input: PromptBuilderInput<T, A>) {

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

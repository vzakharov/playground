import dedent from "dedent-js";
import _ from "lodash";
import { ArrayItem, Falsible } from "~/lib/utils";
import {
  SimplifiedChatFunction, StackUpable, chatFunction, messagesBy, says, stackUp
} from "~/lib/vovas-openai";
import { AssetValues, Asset, GenieData, GenieMessage, OtherTools, GenieSchema, Tool, getActiveAssets, getMissingTools, hasAssetsForTools, toRawMessage, reciteAssets } from "..";


export type BuilderFunctionParameters<
  S extends GenieSchema,
  T extends Tool<S>
> = 'content' | Asset<S, T>;

export type PromptBuilderConfig<
  S extends GenieSchema,
  T extends Tool<S>,
  Pres extends OtherTools<S, T>
> = {
  schema: S;
  mainSystemMessage: string;
  requestFunctionCallAfter: number;
  addAssetsAfter?: number;
  buildSystemMessages: (params: PromptBuilderInput<S, T> & {
    numResponses: number;
    requestFunctionCall: boolean;
    functionCalled: boolean;
    assetValues: AssetValues<S, ArrayItem<Pres>>;
    username: Falsible<string>;
  }) => Record<'pre' | 'post', StackUpable>;
  fnArgs: SimplifiedChatFunction<string, BuilderFunctionParameters<S, T>, never>;
  prerequisites?: Pres;
};

export type PromptBuilderInput<S extends GenieSchema, T extends Tool<S>> = {
  messages: GenieMessage<S, T>[];
  data: GenieData<S>;
};

export class PromptBuilder<
  S extends GenieSchema,
  T extends Tool<S>,
  Pres extends OtherTools<S, T>
> {

  constructor(
    public tool: T,
    public config: PromptBuilderConfig<S, T, Pres>
  ) { }

  build(input: PromptBuilderInput<S, T>) {

    const { messages, data } = input;
    const { 
      mainSystemMessage, requestFunctionCallAfter, addAssetsAfter = 0,
      buildSystemMessages, fnArgs, prerequisites = [], schema
    } = this.config;

    const fn = chatFunction(...fnArgs);

    const numResponses = messagesBy.assistant(messages).length;
    const requestFunctionCall = numResponses >= requestFunctionCallAfter;
    const rawMessages = messages.map(toRawMessage(fn));

    // Check if there are already function calls in the messages
    const functionCalled = rawMessages.some(message => message.function_call);

    const assetValues = getActiveAssets(data, schema);

    if ( !hasAssetsForTools(assetValues, prerequisites) )
      throw new Error(`The following assets are missing: ${getMissingTools(assetValues, prerequisites).join(', ')}`);

    const { username } = data;

    const { 
      pre: preMessage, 
      post: postMessage 
    } = buildSystemMessages({ 
      functionCalled, numResponses, requestFunctionCall, assetValues, 
      username,
      ...input
    });

    return {
      promptMessages: [
        says.system(
          stackUp([
            mainSystemMessage,
            preMessage, 
            prerequisites && numResponses >= addAssetsAfter && dedent`
              For reference:

              ===
              ${reciteAssets(assetValues, schema, prerequisites)}
              ===
            `
          ])
        ),
        ...rawMessages,
        says.system(stackUp(postMessage))
      ],
      fn: requestFunctionCall ? fn : undefined
    };
  };

};

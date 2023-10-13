import _ from "lodash";
import { $if, $throw } from "vovas-utils";
import {
  SimplifiedChatFunction, StackUpable, chatFunction, messagesBy, says, stackUp
} from "~/lib/vovas-openai";
import {
  JobGenieMessage, AppData, AssetsMap, Falsible, FnPropsFor, PickAssets,
  assetsDefinedForChatTypes,
  getActiveAssets, toRawMessage, yamlifyAssets
} from "..";
import { ChatType } from "../ChatType";
import dedent from "dedent-js";


export type PromptBuilderConfig<T extends ChatType, RequiredAssets extends ChatType[] | undefined> = {
  mainSystemMessage: string;
  requestFunctionCallAfter: number;
  addAssetsAfter?: number;
  buildSystemMessages: (params: PromptBuilderInput<T, RequiredAssets> & { 
    numResponses: number;
    requestFunctionCall: boolean;
    functionCalled: boolean;
    assets: PickAssets<RequiredAssets>;
    username: Falsible<string>;
  }) => Record<'pre' | 'post', StackUpable>;
  fnArgs: SimplifiedChatFunction<string, FnPropsFor<T>, never>
  requiredAssets?: RequiredAssets;
};

export type PromptBuilderInput<T extends ChatType, RequiredAssets extends ChatType[] | undefined> = {
  messages: JobGenieMessage<T>[];
  data: AppData;
};

export class PromptBuilder<T extends ChatType, RequiredAssets extends ChatType[] | undefined> {

  constructor(
    public type: T,
    public config: PromptBuilderConfig<T, RequiredAssets>
) { }

  build(input: PromptBuilderInput<T, RequiredAssets>) {

    const { messages, data } = input;
    const { 
      mainSystemMessage, requestFunctionCallAfter, addAssetsAfter = 0,
      buildSystemMessages, fnArgs, requiredAssets
    } = this.config;

    const fn = chatFunction(...fnArgs);

    const numResponses = messagesBy.assistant(messages).length;
    const requestFunctionCall = numResponses >= requestFunctionCallAfter;
    const rawMessages = messages.map(toRawMessage(fn));

    // Check if there are already function calls in the messages
    const functionCalled = rawMessages.some(message => message.function_call);

    const assets = getActiveAssets(data);

    if ( !this.isBuildableWithAssets(assets) )
      throw new Error(`The following assets are missing: ${this.getMissingAssets(assets)}`);

    const { username } = data;

    const { 
      pre: preMessage, 
      post: postMessage 
    } = buildSystemMessages({ 
      functionCalled, numResponses, requestFunctionCall, assets, 
      username,
      ...input
    });

    return {
      promptMessages: [
        says.system(
          stackUp([
            mainSystemMessage,
            preMessage, 
            requiredAssets && numResponses >= addAssetsAfter && dedent`
              User data reference:

              ===
              ${yamlifyAssets(_.pick(assets, ...requiredAssets))}
              ===
            `
          ])
        ),
        ...rawMessages,
        says.system(stackUp(postMessage))
      ],
      fn: requestFunctionCall ? fn : undefined
    };
  }

  isBuildableWithAssets<A extends Partial<AssetsMap>>(assets: A): assets is A & PickAssets<RequiredAssets> {
    return !this.getMissingAssets(assets);
  };

  getMissingAssets(assets: Partial<AssetsMap>) {
    const missingAssets = this.config.requiredAssets?.filter(type => !assets[type]);
    return missingAssets?.length ? missingAssets : undefined;
  };

};

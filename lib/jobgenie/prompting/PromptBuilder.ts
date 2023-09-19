import _ from "lodash";
import { $throw } from "vovas-utils";
import {
  SimplifiedChatFunction, StackUpable, chatFunction, messagesBy, says, stackUp
} from "~/lib/vovas-openai";
import {
  AppChatMessage, AppData, AssetsMap, ChatType, FnPropsFor, PickAssets,
  assetsDefinedForChatTypes,
  getActiveAssets, toRawMessage, yamlifyAssets
} from "..";


export type PromptBuilderConfig<T extends ChatType, RequiredAssets extends ChatType[] | undefined> = {
  mainSystemMessage: string;
  requestFunctionCallAfter: number;
  buildSystemMessages: (params: PromptBuilderInput<T, RequiredAssets> & { 
    isFirstResponse: boolean; 
    requestFunctionCall: boolean;
    assets: PickAssets<RequiredAssets>;
  }) => Record<'pre' | 'post', StackUpable>;
  fnArgs: SimplifiedChatFunction<string, FnPropsFor<T>, never>
  requiredAssets?: RequiredAssets;
};

export type PromptBuilderInput<T extends ChatType, RequiredAssets extends ChatType[] | undefined> = {
  type: T;
  messages: AppChatMessage<T>[];
  // data: A extends ChatType[] ? AppData & { 
  //   assets: {
  //     [K in A[number]]: Assets<K>
  //   }
  // } : AppData;
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
      mainSystemMessage, requestFunctionCallAfter, buildSystemMessages, fnArgs, requiredAssets 
    } = this.config;

    const fn = chatFunction(...fnArgs);

    const numResponses = messagesBy.assistant(messages).length;
    const isFirstResponse = numResponses === 0;
    const requestFunctionCall = numResponses >= requestFunctionCallAfter;

    const assets = getActiveAssets(data);

    if ( !this.isBuildableWithAssets(assets) )
      throw new Error(`The following assets are missing: ${(
        requiredAssets
          ?? $throw('requiredAssets is undefined (this should not happen)')
      ).join(', ')}`);

    
    const { 
      pre: preMessage, 
      post: postMessage 
    } = buildSystemMessages({ isFirstResponse, requestFunctionCall, assets, ...input });


    return {
      promptMessages: [
        says.system(
          stackUp([
            mainSystemMessage,
            preMessage, 
            requiredAssets && [
              "For reference:",
               yamlifyAssets(_.pick(assets, ...requiredAssets))
            ]
          ])
        ),
        ...messages.map(toRawMessage(fn)),
        says.system(stackUp(postMessage))
      ],
      fn: requestFunctionCall ? fn : undefined
    };
  }

  isBuildableWithAssets<A extends Partial<AssetsMap>>(assets: A): assets is A & PickAssets<RequiredAssets> {
    return assetsDefinedForChatTypes(assets, this.config.requiredAssets);
  };

  missingAssets(assets: Partial<AssetsMap>) {
    return this.config.requiredAssets?.filter(type => !assets[type]) ?? [];
  };

};

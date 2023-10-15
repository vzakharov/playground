import dedent from "dedent-js";
import _ from "lodash";
import { ArrayItem, Falsible } from "~/lib/utils";
import {
  SimplifiedChatFunction, StackUpable, chatFunction, messagesBy, says, stackUp
} from "~/lib/vovas-openai";
import {
  $AssetName, AssetMap, AssetName, AssetNameForChatType, GenieChatType, GenieData, GenieMessage, 
  Unbrand, getActiveAssets, toRawMessage, yamlifyAssets
} from "..";


export type BuilderFunctionParameters<
  Map extends AssetMap<T>, 
  T extends GenieChatType
> = 'content' | Unbrand<AssetNameForChatType<Map, T>, $AssetName>;

export type PromptBuilderConfig<
  T extends GenieChatType,
  Schema extends AssetMap<T | ArrayItem<PreTsArr>>,
  PreTsArr extends Exclude<GenieChatType, T>[] | undefined,
> = {
  mainSystemMessage: string;
  requestFunctionCallAfter: number;
  addAssetsAfter?: number;
  assetSchema: Schema;
  buildSystemMessages: (params: PromptBuilderInput<PreTsArr, AssetNameForChatType<Schema, T>> & {
    numResponses: number;
    requestFunctionCall: boolean;
    functionCalled: boolean;
    assetMap: AssetMap<ArrayItem<PreTsArr>>;
    username: Falsible<string>;
  }) => Record<'pre' | 'post', StackUpable>;
  fnArgs: SimplifiedChatFunction<string, BuilderFunctionParameters<Schema, T>, never>;
  prerequisiteChatTypes?: PreTsArr;
};

export type PromptBuilderInput<PreTsArr extends GenieChatType[] | undefined, A extends AssetName> = {
  messages: GenieMessage<A>[];
  data: GenieData<ArrayItem<PreTsArr>>;
};

export class PromptBuilder<
  T extends GenieChatType,
  Map extends AssetMap<T>,
  PreTsArr extends Exclude<GenieChatType, T>[] | undefined,
> {

  constructor(
    public type: T,
    public config: PromptBuilderConfig<T, Map, PreTsArr>
  ) { }

  build(input: PromptBuilderInput<PreTsArr, AssetNameForChatType<Map, T>>) {

    type PreTs = ArrayItem<PreTsArr>;

    const { messages, data } = input;
    const { 
      mainSystemMessage, requestFunctionCallAfter, addAssetsAfter = 0,
      buildSystemMessages, fnArgs, prerequisiteChatTypes
    } = this.config;

    const fn = chatFunction(...fnArgs);

    const numResponses = messagesBy.assistant(messages).length;
    const requestFunctionCall = numResponses >= requestFunctionCallAfter;
    const rawMessages = messages.map(toRawMessage(fn));

    // Check if there are already function calls in the messages
    const functionCalled = rawMessages.some(message => message.function_call);

    const assetMap = getActiveAssets(data) as Map;

    if ( !this.isBuildableWithAssets(assetMap) )
      throw new Error(`The following assets are missing: ${this.getMissingAssets(assetMap)}`);

    const { username } = data;

    const { 
      pre: preMessage, 
      post: postMessage 
    } = buildSystemMessages({ 
      functionCalled, numResponses, requestFunctionCall, assetMap: assetMap, 
      username,
      ...input
    });

    return {
      promptMessages: [
        says.system(
          stackUp([
            mainSystemMessage,
            preMessage, 
            prerequisiteChatTypes && numResponses >= addAssetsAfter && dedent`
              User data reference:

              ===
              ${yamlifyAssets(_.pick(assetMap, ...prerequisiteChatTypes))}
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

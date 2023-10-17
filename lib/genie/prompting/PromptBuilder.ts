import dedent from "dedent-js";
import _ from "lodash";
import { ArrayItem, Falsible, PickByArray } from "~/lib/utils";
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
  prerequisites?: PreTsArr;
};

export type PromptBuilderInput<PreTsArr extends GenieChatType[] | undefined, A extends AssetName> = {
  messages: GenieMessage<A>[];
  data: GenieData<ArrayItem<PreTsArr>>;
};

export class PromptBuilder<
  T extends GenieChatType,
  Schema extends AssetMap<T | ArrayItem<PreTsArr>>,
  PreTsArr extends Exclude<GenieChatType, T>[] | undefined,
> {

  constructor(
    public type: T,
    public config: PromptBuilderConfig<T, Schema, PreTsArr>
  ) { }

  build(input: PromptBuilderInput<PreTsArr, AssetNameForChatType<Schema, T>>) {

    type PreTs = ArrayItem<PreTsArr>;

    const { messages, data } = input;
    const { 
      mainSystemMessage, requestFunctionCallAfter, addAssetsAfter = 0,
      buildSystemMessages, fnArgs, prerequisites
    } = this.config;

    const fn = chatFunction(...fnArgs);

    const numResponses = messagesBy.assistant(messages).length;
    const requestFunctionCall = numResponses >= requestFunctionCallAfter;
    const rawMessages = messages.map(toRawMessage(fn));

    // Check if there are already function calls in the messages
    const functionCalled = rawMessages.some(message => message.function_call);

    const assetMap = getActiveAssets(data) as Schema;

    if ( !this.isBuildableWithAssets(assetMap) )
      throw new Error(`The following assets are missing: ${this.getMissingPrerequisites(assetMap)}`);

    const { username } = data;

    const { 
      pre: preMessage, 
      post: postMessage 
    } = buildSystemMessages({ 
      functionCalled, numResponses, requestFunctionCall, assetMap, 
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
              User data reference:

              ===
              ${yamlifyAssets(_.pick(assetMap, ...prerequisites))}
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

  getMissingPrerequisites(assets: Partial<Schema>) {
    const missingPrerequisites = this.config.prerequisites?.filter(type => !(type in assets));
    return missingPrerequisites?.length ? missingPrerequisites : undefined;
  };

  isBuildableWithAssets<A extends Partial<Schema>>(assets: A): assets is A & PickByArray<Schema, PreTsArr> {
    return !this.getMissingPrerequisites(assets);
  };


};

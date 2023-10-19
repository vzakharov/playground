import dedent from "dedent-js";
import { StringKey } from "vovas-utils";
import { ArrayItem, Falsible } from "~/lib/utils";
import {
  StackUpable, chatFunction, messagesBy, says, stackUp
} from "~/lib/vovas-openai";
import { Branded, Dict, GenieData, GenieMessage, OtherTools, PartialAssetValues, getActiveAssets, getMissingTools, getPrerequisites, hasAssetsForTools, reciteAssets, toRawMessage } from "..";


export type BuilderFunctionParameters<Asset extends string> = 'content' | Asset;

export type AnyTool = Tool<any, any, any>;

export type Toolset = AnyTool[];

export type ToolFrom<S extends Toolset> = ArrayItem<S>;

export type ToolWithId<S extends Toolset, Id extends ToolFrom<S>['id']> =
  Extract<ToolFrom<S>, { id: Id }>;

export type RequiredId<S extends Toolset> = ArrayItem<ToolFrom<S>['config']['requires']>['id'];

export type ValidToolset<S extends Toolset> =
  RequiredId<S> extends ToolFrom<S>['id'] 
    ? S 
    : `Required tool missing, id = ${Exclude<RequiredId<S>, ToolFrom<S>['id']>}`;

export type AssetForTool<T extends AnyTool> = T extends Tool<any, infer A, any> ? A : never;

export type ToTool<ST extends Toolset | AnyTool> = 
  ST extends Toolset ? ToolFrom<ST> : ST;

export type Asset<ST extends Toolset | AnyTool> = 
  AssetForTool<ToTool<ST>>;

export type AssetValues<T extends Toolset | AnyTool> = Dict<Asset<T>>;

export type BuildInput<S extends Toolset, T extends AnyTool> = {
  messages: GenieMessage<T>[];
  data: GenieData<S>;
};

export type BuildSystemMessages<Reqs extends Toolset> = (params: {
  numResponses: number;
  requestFunctionCall: boolean;
  functionCalled: boolean;
  assetValues: AssetValues<Reqs>;
  username: Falsible<string>;
}) => Record<'pre' | 'post', StackUpable>;


export type ToolConfig<
  Asset extends string,
  Reqs extends Toolset,
> = {
  mainSystemMessage: string;
  accompanyingTextKey?: string;
  requestFunctionCallAfter: number;
  addAssetsAfter?: number;
  buildSystemMessages: BuildSystemMessages<Reqs>;
  // fnArgs: SimplifiedChatFunction<string, Asset, never>;
  assets: Dict<Asset>;
  requires: Reqs;
};

export class Tool<
  Id extends string,
  A extends string,
  Reqs extends Toolset,
> {

  constructor(
    public id: Id,
    public config: ToolConfig<A, Reqs>,
  ) { }

  build(input: BuildInput<Reqs, this>) {

    const { messages, data } = input;
    const { 
      mainSystemMessage, requestFunctionCallAfter, addAssetsAfter = 0,
      buildSystemMessages, assets, accompanyingTextKey = 'replyMessage'
    } = this.config;

    const fn = chatFunction('reply', 'Replies to the user with structured data', {
      [accompanyingTextKey]: 'Accompanying text to go before the structured data, narratively continuing the conversation',
      ...assets
    });

    const numResponses = messagesBy.assistant(messages).length;
    const requestFunctionCall = numResponses >= requestFunctionCallAfter;
    const rawMessages = messages.map(toRawMessage(fn));

    // Check if there are already function calls in the messages
    const functionCalled = rawMessages.some(message => message.function_call);

    const assetValues = getActiveAssets(data, schema);
    const prerequisites = getPrerequisites(schema, this.tool);

    if ( !hasAssetsForTools(assetValues, prerequisites) )
      throw new Error(`The following assets are missing: ${this.getMissingTools(assetValues).join(', ')}`);

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

  getMissingTools(assetValues: PartialAssetValues<S, ArrayItem<OtherTools<S, T>>>) {
    const { requires: prerequisites } = this.config;
    if ( !prerequisites ) return [];
    return getMissingTools(assetValues, prerequisites);
  };

};

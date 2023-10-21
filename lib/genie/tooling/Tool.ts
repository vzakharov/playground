import dedent from "dedent-js";
import { Falsible, allPropsDefined, undefinedProps } from "~/lib/utils";
import {
  chatFunction, messagesBy, says, stackUp
} from "~/lib/vovas-openai";
import { AnyTool, AssetValuesForSet, BuildInput, BuildCallback, Dict, ToolFrom, Toolset, getActiveAssets, getActiveAssetsForSet, reciteAssets, toRawMessage, toolWithId, GenieData, GenieMessage, GenieState } from "..";

export type ToolConfig<
  Asset extends string,
  Reqs extends Toolset
> = {
  system: string;
  generateAssetsAfter: number;
  reciteAssetsAfter?: number;
  build: BuildCallback<Reqs>;
  autoQuery?: string | ( ( context?: { globalData?: GenieData<Reqs>, globalState?: GenieState<Reqs> }) => string );
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

  build(input: BuildInput<this>) {

    const { messages, globalData } = input;
    const { 
      system: mainSystemMessage, generateAssetsAfter, reciteAssetsAfter = 0,
      build: buildCallback, assets: assetDescriptions, requires
    } = this.config;

    const fn = chatFunction('reply', 'Replies to the user with structured data', {
      replyMessage: 'Accompanying text to go before the structured data, narratively continuing the conversation',
      ...assetDescriptions
    });

    const numResponses = messagesBy.assistant(messages).length;
    const shouldGenerateAssets = numResponses >= generateAssetsAfter;
    const rawMessages = messages.map(toRawMessage(fn));

    // Check if there are already function calls in the messages
    const functionCalled = rawMessages.some(message => message.function_call);

    const assetValues = getActiveAssets(globalData, requires);

    if ( !allPropsDefined(assetValues) )
      throw new Error(`The following assets are missing: ${this.getMissingTools(assetValues).join(', ')}`);

    assetValues
    const { username } = globalData;

    const { 
      pre: preMessage, 
      post: postMessage 
    } = buildCallback({ 
      functionCalled, numResponses, shouldGenerateAssets, assets: assetValues, 
      username,
      ...input
    });

    return {
      promptMessages: [
        says.system(
          stackUp([
            mainSystemMessage,
            preMessage, 
            requires && numResponses >= reciteAssetsAfter && dedent`
              For reference:

              ===
              ${reciteAssets(assetValues, requires)}
              ===
            `
          ])
        ),
        ...rawMessages,
        says.system(stackUp(postMessage))
      ],
      fn: shouldGenerateAssets ? fn : undefined
    };
  };

  getMissingTools(assetValues: Partial<AssetValuesForSet<Reqs>>): ToolFrom<Reqs>[] {
    return undefinedProps(assetValues).map(toolId => toolWithId(this.config.requires, toolId));
  };

};

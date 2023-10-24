import dedent from "dedent-js";
import { $if, allPropsDefined, undefinedProps } from "~/lib/utils";
import {
  chatFunction, messagesBy, says, stackUp
} from "~/lib/vovas-openai";
import { AssetSpecs, AssetValuesForSet, BuildCallback, BuildInput, GenieContext, ToolFrom, ToolIdFrom, Toolset, assetDescriptions, getActiveAssets, reciteAssets, toFullSpecs, toRawMessage, toolWithId } from "..";
import _ from "lodash";

export type ToolConfig<
  Asset extends string,
  Reqs extends Toolset
> = {
  system: string;
  generateAssetsAfter: number;
  reciteAssetsAfter?: number;
  build: BuildCallback<Reqs>;
  autoQuery?: string | ( ( context: GenieContext<Reqs>) => string );
  assets: AssetSpecs<Asset>;
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
      build: buildCallback, assets: assetSpecs, requires
    } = this.config;

    const fn = chatFunction('reply', 'Replies to the user with structured data', {
      replyMessage: 'Accompanying text to go before the structured data, narratively continuing the conversation',
      ...assetDescriptions(assetSpecs)
    });

    const numResponses = messagesBy.assistant(messages).length;
    const shouldGenerateAssets = numResponses >= generateAssetsAfter;
    const rawMessages = messages.map(toRawMessage(fn));

    // Check if there are already function calls in the messages
    const functionCalled = rawMessages.some(message => message.function_call);

    const assetValues = getActiveAssets(globalData, requires);

    if ( !allPropsDefined(assetValues) )
      throw new Error(`The following assets are missing: ${this.getMissingRequires(assetValues)!.join(', ')}`);

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

  getMissingRequires(assetValues: Partial<AssetValuesForSet<Reqs>>): ToolFrom<Reqs>[] | undefined {
    const { requires } = this.config;
    const missingRequires = undefinedProps(assetValues)
      .filter(toolId => requires.includes(toolId as any))
      .map(toolId => toolWithId(this.config.requires, toolId));
    return missingRequires.length ? missingRequires : undefined;
  };

};
import dedent from "dedent-js";
import { allPropsDefined, undefinedProps } from "~/lib/utils";
import {
  chatFunction, messagesBy, says, stackUp
} from "~/lib/vovas-openai";
import { AssetValuesForSet, BuildInput, ToolConfig, ToolFrom, Toolset, getActiveAssets, reciteAssets, toRawMessage, toolWithId } from "..";


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
      buildSystemMessages, assets: assetDescriptions, accompanyingTextKey = 'replyMessage', requires
    } = this.config;

    const fn = chatFunction('reply', 'Replies to the user with structured data', {
      [accompanyingTextKey]: 'Accompanying text to go before the structured data, narratively continuing the conversation',
      ...assetDescriptions
    });

    const numResponses = messagesBy.assistant(messages).length;
    const requestFunctionCall = numResponses >= requestFunctionCallAfter;
    const rawMessages = messages.map(toRawMessage(fn));

    // Check if there are already function calls in the messages
    const functionCalled = rawMessages.some(message => message.function_call);

    const assetValues = getActiveAssets(data, requires);

    if ( !allPropsDefined(assetValues) )
      throw new Error(`The following assets are missing: ${this.getMissingTools(assetValues).join(', ')}`);

    assetValues
    const { username } = data;

    const { 
      pre: preMessage, 
      post: postMessage 
    } = buildSystemMessages({ 
      functionCalled, numResponses, requestFunctionCall, assets: assetValues, 
      username,
      ...input
    });

    return {
      promptMessages: [
        says.system(
          stackUp([
            mainSystemMessage,
            preMessage, 
            requires && numResponses >= addAssetsAfter && dedent`
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
      fn: requestFunctionCall ? fn : undefined
    };
  };

  getMissingTools(assetValues: Partial<AssetValuesForSet<Reqs>>): ToolFrom<Reqs>[] {
    return undefinedProps(assetValues).map(toolId => toolWithId(this.config.requires, toolId));
  };

};

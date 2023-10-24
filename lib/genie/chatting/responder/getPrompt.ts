import dedent from "dedent-js";
import { allPropsDefined, undefinedProps } from "~/lib/utils";
import { AnyTool, assetDescriptions, getActiveAssetsForSet, reciteAssets, toRawMessage } from "../..";
import { Responder } from "./responder";
import { chatFunction, messagesBy, says, stackUp } from "~/lib/vovas-openai";

export function getPrompt<T extends AnyTool>(
  this: Responder<T>,
  messages = this.data.messages
) {

  const { 
    config: { 
      globalData, 
      tool: { config: {
        system: mainSystemMessage, generateAssetsAfter, reciteAssetsAfter = 0,
        build: buildCallback, assets: assetSpecs, requires  
      } } 
    }
  } = this;

  const fn = chatFunction('reply', 'Replies to the user with structured data', {
    replyMessage: 'Accompanying text to go before the structured data, narratively continuing the conversation',
    ...assetDescriptions(assetSpecs)
  });

  const numResponses = messagesBy.assistant(messages).length;
  const shouldGenerateAssets = numResponses >= generateAssetsAfter;
  const rawMessages = messages.map(toRawMessage(fn));

  // Check if there are already function calls in the messages
  const functionCalled = rawMessages.some(message => message.function_call);

  const assetValues = getActiveAssetsForSet(globalData, requires);

  if ( !allPropsDefined(assetValues) )
    throw new Error(`The following assets are missing: ${undefinedProps(assetValues).join(', ')}`);

  assetValues
  const { username } = globalData;

  const { 
    pre: preMessage, 
    post: postMessage 
  } = buildCallback({ 
    functionCalled, numResponses, shouldGenerateAssets, assets: assetValues, username
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
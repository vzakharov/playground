import dedent from "dedent-js";
import { allPropsDefined, undefinedProps } from "~/lib/utils";
import { AnyTool, GlobalData, GlobalState, SetFor, assetDescriptions, getActiveAssetsForSet, reciteAssets, toRawMessage } from "../..";
import { Responder } from "./responder";
import { chatFunction, messagesBy, says, stackUp } from "~/lib/vovas-openai";

export function getPrompt<
  T extends AnyTool,
  GD extends GlobalData<SetFor<T>>
>(
  this: Responder<T, GD, any>,
  messages = this.data.messages
) {

  const { 
    config: { 
      globalData, 
      tool: { config: {
        system: mainSystemMessage, generateAssetsAfter, reciteAssetsAfter = 0,
        build: buildCallback, assets: assetSpecs, requires  
      } } 
    },
    activeAssets
  } = this;

  if ( !allPropsDefined(activeAssets) )
    throw new Error(`The following assets are missing: ${undefinedProps(activeAssets).join(', ')}`);

  const fn = chatFunction('reply', 'Replies to the user with structured data', {
    replyMessage: 'Accompanying text to go before the structured data, narratively continuing the conversation',
    ...assetDescriptions(assetSpecs)
  });

  const numResponses = messagesBy.assistant(messages).length;
  const shouldGenerateAssets = numResponses >= generateAssetsAfter;
  const rawMessages = messages.map(toRawMessage(fn));

  // Check if there are already function calls in the messages
  const functionCalled = rawMessages.some(message => message.function_call);

  const { username } = globalData;

  const { 
    pre: preMessage, 
    post: postMessage 
  } = buildCallback({ 
    functionCalled, numResponses, shouldGenerateAssets, assets: activeAssets, username
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
            ${reciteAssets(activeAssets, requires)}
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
import dedent from "dedent-js";
import { Flatpactable, allPropsDefined, flatpact, undefinedProps } from "~/lib/utils";
import { StackUpable, chatFunction, messagesBy, says, stackUp } from "~/lib/vovas-openai";
import { AnyTool, GenieMessage, GlobalData, SetFor, assetDescriptions, reciteAssets, toRawMessage } from "../..";
import { Responder } from "./responder";

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
        system: mainSystemMessage, generateAssetsAfter = 0, reciteAssetsAfter = 0,
        build: buildCallback, assets: assetSpecs, requires  
      } } 
    },
    activeAssets
  } = this;

  if ( !allPropsDefined(activeAssets) )
    throw new Error(`The following assets are missing: ${undefinedProps(activeAssets).join(', ')}`);

  const numResponses = messagesBy.assistant(messages).length;
  const shouldGenerateAssets = !!assetSpecs && numResponses >= generateAssetsAfter;

  const fn = shouldGenerateAssets ? chatFunction('reply', 'Replies to the user with structured data', {
    replyMessage: 'Accompanying text to go before the structured data, narratively continuing the conversation',
    ...assetDescriptions(assetSpecs)
  }) : undefined;

  const toRaw = toRawMessage(fn);
  const rawMessages = messages.map(toRaw);

  // Check if there are already function calls in the messages
  const functionCalled = rawMessages.some(message => message.function_call);

  const { username } = globalData;

  const { 
    pre: preMessages, 
    post: postMessages 
  } = buildCallback({ 
    functionCalled, numResponses, shouldGenerateAssets, assets: activeAssets, username
  });

  function toMessages(messages: Flatpactable<string | GenieMessage<T>>[]) {
    return flatpact(messages).map(message => 
      typeof message === 'string' 
        ? says.system(message)
        : toRaw(message)
    );
  };

  return {
    promptMessages: toMessages([
      mainSystemMessage,
      preMessages, 
      requires && numResponses >= reciteAssetsAfter && dedent`
        For reference:

        ===
        ${reciteAssets(activeAssets, requires)}
        ===
      `,
      rawMessages,
      postMessages
    ]),
    fn
  };
  
};
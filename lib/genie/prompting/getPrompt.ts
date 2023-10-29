import dedent from "dedent-js";
import { Flatpactable, allPropsDefined, flatpact, undefinedProps } from "~/lib/utils";
import { chatFunction, messagesBy, says } from "~/lib/vovas-openai";
import { GenieMessage, GlobalData, Tool, Toolset, assetDescriptions, getActiveAssetsForSet, reciteAssets, toRawMessage } from "..";

export function getPrompt<
  A extends string,
  Reqs extends Toolset
>(
  tool: Tool<any, A, Reqs>,
  messages: GenieMessage<Tool<any, A, Reqs>>[],
  globalData: GlobalData<Reqs>,
) {

  type T = Tool<any, A, Reqs>;

  const { 
    system: mainSystemMessage, generateAssetsAfter = 0, reciteAssetsAfter = 0,
    build: buildCallback, assets: assetSpecs, requires  
  } = tool.config;

  const activeAssets = getActiveAssetsForSet(globalData, requires);

  if ( !allPropsDefined(activeAssets) )
    throw new Error(`The following assets are missing: ${undefinedProps(activeAssets).join(', ')}`);

  const numResponses = messagesBy.assistant(messages).length;
  const shouldGenerateAssets = !!assetSpecs && numResponses >= generateAssetsAfter;

  const fn = shouldGenerateAssets ? chatFunction('reply', 'Replies to the user with structured data', {
    replyMessage: 'Accompanying text to go before the structured data, narratively continuing the conversation',
    ...assetDescriptions(assetSpecs)
  }) : undefined;

  const toRaw = toRawMessage(fn);
  // const rawMessages = messages.map(toRaw);

  // Check if there are already function calls in the messages
  // const functionCalled = rawMessages.some(message => message.function_call);
  const functionCalled = messages.some(message => !!message.assets);

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
      messages,
      postMessages
    ]),
    fn
  };
  
};
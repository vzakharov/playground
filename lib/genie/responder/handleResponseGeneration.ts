import { AssetName, BaseChatController, ChatController, GenieChatType, Resolvable } from "..";

export class GenerationCanceledException extends Error {}

export async function handleResponseGeneration<T extends GenieChatType, A extends AssetName>(
  this: BaseChatController<T, A>
) {

  const { type, messages, state, previousGeneration } = this;

  if (state.generating?.inProgress) {
    throw new Error('Cannot generate while already generating');
    // TODO: Add better handling for this
  };

  const interval = setInterval(() => {
    state.msExpected = Math.max((state.msExpected ?? 0) - 1000, 0);
  }, 1000);

  try {

    const responseMessage = await (
      state.generating =
      new Resolvable(
        generateResponse({ type, messages, state, data, globalState, previousGeneration })
      )
    ).promise;

    messages.push(responseMessage);

  } catch (e: any) {

    if ( e instanceof ResolvablePromiseCanceled ) { 
      return 
    };
    if ( e instanceof GenerateException ) {
      const lastMessage = _.last(messages);
      if ( lastMessage && isBy.user(lastMessage) ) {
        this.editMessage(lastMessage);
      }
    };

    alert(e.message);

  } finally {

    clearInterval(interval);

  };

};

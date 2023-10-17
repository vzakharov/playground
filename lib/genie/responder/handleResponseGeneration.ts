import _ from "lodash";
import { Resolvable, ResolvablePromiseCanceled } from "~/lib/utils";
import { GenerateException, isBy } from "~/lib/vovas-openai";
import {
  AssetName, BaseChatController, GenieChatType, LeftoversMixin, ResponderMixinConfig, generateResponse
} from "..";

export class GenerationCanceledException extends Error {}

export async function handleResponseGeneration<T extends GenieChatType, A extends AssetName>(
  this: BaseChatController<T, A> & LeftoversMixin<A>,
  config: ResponderMixinConfig
) {

  const { messages, state } = this;

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
        generateResponse.call(this)
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

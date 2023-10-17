import _ from "lodash";
import { Resolvable, ResolvablePromiseCanceled } from "~/lib/utils";
import { GenerateException, isBy } from "~/lib/vovas-openai";
import {
  AssetName, GenieChatType, Responder
} from "..";

export class GenerationCanceledException extends Error {}

export async function handleResponseGeneration<
  Ts extends GenieChatType, 
  T extends Ts, 
  A extends AssetName
>(
  this: Responder<Ts, T, A>
) {

  const { config: { alert, state }, messages } = this;

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
        this.generateResponse()
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

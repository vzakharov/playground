import _ from "lodash";
import { Resolvable, ResolvablePromiseCanceled } from "~/lib/utils";
import { GenerateException, isBy } from "~/lib/vovas-openai";
import {
  Responder, GenieSchema, ToolName, AnyTool
} from "../..";

export class GenerationCanceledException extends Error {}

export async function handleResponseGeneration<
  T extends AnyTool
>(
  this: Responder<T>
) {

  const { config: { state }, messages } = this;

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

    state.error = e;

  } finally {

    clearInterval(interval);

  };

};

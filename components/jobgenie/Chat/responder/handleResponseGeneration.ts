import { globalState } from 'components/jobgenie/state';
import _ from 'lodash';
import { ChatType, generateResponse, Resolvable, ResolvablePromiseCanceled } from '~/lib/jobgenie';
import { GenerateException, isBy } from '~/lib/vovas-openai';
import { data } from '../../data';
import { ChatController } from '../controller';

export class GenerationCanceledException extends Error {}

export async function handleResponseGeneration<T extends ChatType>(this: ChatController<T>) {

  const { type, messages, state } = this;

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
        generateResponse({ type, messages, state, data }, globalState)
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

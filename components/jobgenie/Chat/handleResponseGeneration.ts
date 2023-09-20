import _ from 'lodash';
import { generating, msExpected } from '~/components/jobgenie/refs';
import { ChatType, generateResponse, newResolvablePromise } from '~/lib/jobgenie';
import { GenerateException, isBy } from '~/lib/vovas-openai';
import { data } from '../data';
import { state } from "../state";
import { BaseChatController } from './controller';

export class GenerationCanceledException extends Error {}

export async function handleResponseGeneration<T extends ChatType>(controller: BaseChatController<T>) {
  const { type, messages } = controller;
  if (generating.value?.inProgress) {
    throw new Error('Cannot generate while already generating');
    // TODO: Add better handling for this
  }
  const interval = setInterval(() => {
    msExpected.value = Math.max((msExpected.value ?? 0) - 1000, 0) || null;
  }, 1000);

  try {

    const responseMessage = await (
      generating.value = 
        newResolvablePromise(
          generateResponse({ type, messages, msExpected, data }, state)
        )
    );

    messages.push(responseMessage);

  } catch (e: any) {

    if ( e instanceof GenerationCanceledException) { return };
    if ( e instanceof GenerateException ) {
      const lastMessage = _.last(messages);
      if ( lastMessage && isBy.user(lastMessage) ) {
        controller.editMessage(lastMessage);
      }
    };

    alert(e.message);

  } finally {

    clearInterval(interval);

  };

};

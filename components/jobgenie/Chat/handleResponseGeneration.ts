import { generating, msExpected } from '~/components/jobgenie/refs';
import { state } from "../state";
import { AppChatMessage, ChatType, generateResponse } from '~/lib/jobgenie';
import { GenerateException, isBy } from '~/lib/vovas-openai';
import { data } from '../data';
import _ from 'lodash';
import { BaseChatController } from './controller';
import { $throw } from 'vovas-utils';

export class GenerationCanceledException extends Error {}

export async function handleResponseGeneration<T extends ChatType>(controller: BaseChatController<T>) {
  const { type, messages } = controller;
  if (generating.inProgress) {
    throw new Error('Cannot generate while already generating');
    // TODO: Add better handling for this
  }
  const interval = setInterval(() => {
    msExpected.value = Math.max((msExpected.value ?? 0) - 1000, 0) || null;
  }, 1000);
  const { previousResolved } = generating;
  generating.start();
  try {
    const responseMessage = await generateResponse({ type, messages, msExpected, data }, state);
    if ( 
      generating.rejectedWith instanceof GenerationCanceledException 
      || previousResolved !== generating.previousResolved
      // (i.e. if the generation was restarted while this one was in progress)
      // TODO: Think of how to handle this better
      // E.g.:
      // const { result: responseMessage, isStillInProgress } = await generating.isStillInProgressAfter(
      //   generateResponse({ type, messages, msExpected, data }, state)
      // );
    ) {
      return;
    }
    messages.push(responseMessage);
  } catch (e: any) {

    const lastMessage = _.last(messages);
    if ( lastMessage && isBy.user(lastMessage) ) {
      controller.editMessage(lastMessage);
    }
    alert(e.message);

  } finally {
    generating.resolveIfInProgress();
    clearInterval(interval);
  }
}

import { generating, msExpected } from '~/components/jobgenie/refs';
import { state } from "../state";
import { AppChatMessage, ChatType, generateResponse } from '~/lib/jobgenie';
import { GenerateException } from '~/lib/vovas-openai';
import { data } from '../data';

export async function handleResponseGeneration<T extends ChatType>(type: T, messages: AppChatMessage<T>[]) {
  if (generating.inProgress) {
    throw new Error('Cannot generate while already generating');
    // TODO: Add better handling for this
  }
  const interval = setInterval(() => {
    msExpected.value = Math.max((msExpected.value ?? 0) - 1000, 0) || null;
  }, 1000);
  generating.start();
  try {
    const responseMessage = await generateResponse({ type, messages, msExpected, data }, state);
    messages.push(responseMessage);
  } catch (e: any) {
    if (e instanceof GenerateException) {
      // Remove last message and give an alert
      messages.pop();
      alert(e.message);
    }
  } finally {
    generating.resolve();
    clearInterval(interval);
  }
}

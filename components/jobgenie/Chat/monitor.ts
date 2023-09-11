import _ from 'lodash';
import { also } from 'vovas-utils';
import { generateResponse } from '~/lib/jobgenie';
import { GenerateException, says } from '~/lib/vovas-openai';
import { ChatController } from './controller';

export function monitor({
  messages, generating, type, username
}: ChatController) {

  watch(messages, async () => {

    await generating.promise;

    const lastMessage = _.last(messages)
      ?? also(
        says.user(`Hi, I’m ${username.value}`),
        m => messages.push(m)
      );

    if (lastMessage.role === 'user') {
      try {
        generating.start();
        const response = await generateResponse(type, messages);
        messages.push(says.assistant(response));
      } catch (e: any) {
        if (e instanceof GenerateException) {
          // Remove last message and give an alert
          messages.pop();
          alert(e.message);
        }
      } finally {
        generating.resolve();
      }
    }
  }, { immediate: true });

}

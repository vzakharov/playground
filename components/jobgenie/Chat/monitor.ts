import _ from 'lodash';
import { Resolvable, also } from 'vovas-utils';
import { generateResponse } from '~/lib/jobgenie';
import { ChatMessage, GenerateException, says } from '~/lib/vovas-openai';
import { ChatController } from './controller/controller';
import { UnwrapRef } from 'nuxt/dist/app/compat/capi';
import { ChatType } from './types';

export type MonitorParams = {
  messages: UnwrapRef<ChatMessage[]>;
  generating: UnwrapRef<Resolvable<void>>;
  type: ChatType,
  username: Ref<string>;
};

export function monitor({
  messages, generating, type, username
}: MonitorParams) {

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

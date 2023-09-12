import _ from 'lodash';
import { also } from 'vovas-utils';
import { generateResponse } from '~/lib/jobgenie';
import { GenerateException, isBy, says } from '~/lib/vovas-openai';
import { BaseChatController, Class } from './controller';


export function Monitorable<C extends Class<BaseChatController>>(Base: C) {

  return class Monitorable extends Base {

    constructor(...args: any[]) {
      super(...args);
      this.monitor();
    };

    monitor() {

      const {
        messages, generating, type, username
      } = this;

      watch(messages, async () => {

        await generating.promise;

        const lastMessage = _.last(messages)
          ?? also(
            says.user(`Hi, I’m ${username.value}`),
            m => messages.push(m)
          );

        if (isBy.user(lastMessage)) {
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

  }

}

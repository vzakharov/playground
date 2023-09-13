import _ from 'lodash';
import { $if, Class, also, give, is } from 'vovas-utils';
import { generateResponse } from '~/lib/jobgenie';
import { GenerateException, isBy, says } from '~/lib/vovas-openai';
import { BaseChatController } from './controller';
import { data } from '../data';


export function Monitorable<C extends Class<BaseChatController>>(Base: C) {

  return class C extends Base {

    constructor(...args: any[]) {
      super(...args);
      this.monitor();
    };

    monitor() {

      const {
        messages, generating, type,
      } = this;

      watch(messages, async () => {

        await generating.promise;

        const lastMessage = _.last(messages)
          ?? also(
            says.user(`Hi, I’m ${data.username ?? 'looking for some assistance'}.`),
            m => messages.push(m)
          );

        if (isBy.user(lastMessage)) {
          try {
            generating.start();
            const response = await generateResponse(type, messages);
            messages.push(says.assistant(
              $if(response, is.string, give.itself)
              .else(({ leadIn, dna }) => `${leadIn}\n\n> ${dna}`)
            ));
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

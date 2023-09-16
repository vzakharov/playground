import _ from 'lodash';
import { Class, also, is } from 'vovas-utils';
import { ChatType, ContentAndAssets, generateResponse } from '~/lib/jobgenie';
import { GenerateException, globalUsageContainer, isBy, says } from '~/lib/vovas-openai';
import { generating, msExpected, state } from '~/components/jobgenie/refs';
import { data } from '../data';
import { BaseChatController } from './controller';
import { autoMessage } from './autoMessage';


export function ChatResponder<T extends ChatType>(Base: Class<BaseChatController<T>>) {

  return class R extends Base {

    constructor(...args: any[]) {
      super(...args);
      this.monitor();
    };

    monitor() {

      const {
        messages,
      } = this;

      watch(messages, async messages => {

        const { type } = this;
  
        const lastMessage = _.last(messages)
          ?? also(
            autoMessage[type]?.(),
            m => m && messages.push(m)
          );
        
        if (!lastMessage || isBy.user(lastMessage)) {
          try {
            await generating.restartAfterWait();
            const interval = setInterval(() => {
              msExpected.value = Math.max((msExpected.value ?? 0 ) - 1000, 0) || null
            }, 1000);
            const result = await generateResponse( { type, messages, msExpected, data }, state );
            clearInterval(interval);
            messages.push(result);
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

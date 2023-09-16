import _ from 'lodash';
import { Class, also } from 'vovas-utils';
import { dataLastLoaded, generating, msExpected, state } from '~/components/jobgenie/refs';
import { AppChatMessage, ChatType, debugAnd, generateResponse } from '~/lib/jobgenie';
import { GenerateException, isBy } from '~/lib/vovas-openai';
import { data, findOrCreateChat } from '../data';
import { autoMessage } from './autoMessage';
import { BaseChatController } from './controller';


export function ChatResponder<T extends ChatType>(Base: Class<BaseChatController<T>>) {

  return class R extends Base {

    constructor(...args: any[]) {
      super(...args);
      this.monitor();
    };

    monitor() {
      
      // debugger
      watch(this.messages, () => this.onMessagesChanged(), { immediate: true });

    }


    private async onMessagesChanged() {

      // debugger;

      const { type, messages } = this;

      const lastMessage = _.last(messages)
        ?? also(
          autoMessage[type]?.(),
          m => m && messages.push(m)
        );

      if (!lastMessage || isBy.user(lastMessage)) {
        if (generating.inProgress) {
          throw new Error('Cannot generate while already generating');
          // TODO: Add better handling for this
        }
        const interval = setInterval(() => {
          msExpected.value = Math.max((msExpected.value ?? 0) - 1000, 0) || null;
        }, 1000);
        generating.start();
        try {
          const result = await generateResponse({ type, messages, msExpected, data }, state);
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
    }
  }

}

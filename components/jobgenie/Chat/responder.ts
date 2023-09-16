import _ from 'lodash';
import { Class, also } from 'vovas-utils';
import { dataLastLoaded } from '~/components/jobgenie/refs';
import { ChatType, debugAnd } from '~/lib/jobgenie';
import { isBy } from '~/lib/vovas-openai';
import { data, findOrCreateChat } from '../data';
import { autoMessage } from './autoMessage';
import { BaseChatController } from './controller';
import { handleResponseGeneration } from './handleResponseGeneration';


export function ChatResponder<T extends ChatType>(Base: Class<BaseChatController<T>>) {

  return class R extends Base {

    constructor(...args: any[]) {

      super(...args);

      watch(this.messages, () => {

        const { type, messages } = this;
  
        const lastMessage = _.last(messages)
          ?? also(
            autoMessage[type]?.(),
            m => m && messages.push(m)
          );
  
        if (!lastMessage || isBy.user(lastMessage)) {
          handleResponseGeneration(type, messages);
        }

      }, { immediate: true });
    
    };

  }

}


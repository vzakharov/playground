import _ from 'lodash';
import { also } from 'vovas-utils';
import { Tool } from '~/lib/jobgenie';
import { isBy } from '~/lib/vovas-openai';
import { autoMessage } from '../autoMessage';
import { ChatController } from '../controller';

export function watchForResponseGeneration<T extends Tool>(this: ChatController<T>) {

  watch(this.messages, () => {
    const { type, messages } = this;
    const lastMessage = _.last(messages)
      ?? also(
        autoMessage[type]?.(),
        m => m && messages.push(m)
      );
    if (!lastMessage || isBy.user(lastMessage)) {
      this.handleResponseGeneration();
    }
  }, { immediate: true });

};

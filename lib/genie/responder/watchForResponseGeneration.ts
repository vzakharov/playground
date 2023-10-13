import _ from 'lodash';
import { also } from 'vovas-utils';
import { ChatType } from '~/lib/jobgenie';
import { isBy } from '~/lib/vovas-openai';
import { autoMessage } from '../autoMessage';
import { GenieController } from '../controller';

export function watchForResponseGeneration<T extends ChatType>(this: GenieController<T>) {

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

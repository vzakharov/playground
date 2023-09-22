import _ from 'lodash';
import { also } from 'vovas-utils';
import { ChatType } from '~/lib/jobgenie';
import { isBy } from '~/lib/vovas-openai';
import { autoMessage } from './autoMessage';
import { BaseChatController } from './controller';
import { handleResponseGeneration } from './handleResponseGeneration';


export class ChatResponder<T extends ChatType> extends BaseChatController<T> {

  constructor(...args: ConstructorParameters<typeof BaseChatController<T>>) {

    super(...args);

    watch(this.messages, () => {

      const { type, messages } = this;

      const lastMessage = _.last(messages)
        ?? also(
          autoMessage[type]?.(),
          m => m && messages.push(m)
        );

      if (!lastMessage || isBy.user(lastMessage)) {
        handleResponseGeneration(this);
      }

    }, { immediate: true });

  };

};


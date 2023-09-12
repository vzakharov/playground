import _ from 'lodash';
import { UnwrapRef } from 'nuxt/dist/app/compat/capi';
import { Resolvable, mixinable } from 'vovas-utils';
import { ChatMessage, isBy, says } from '~/lib/vovas-openai';
import { appData, findChat } from '../data';
import { Monitorable } from './monitorable';
import { QuoteHandler } from './quoteHandler';
import { ChatType } from './types';

export class BaseChatController {

  messages: UnwrapRef<ChatMessage[]>;
  userMessage = ref('');
  generating = reactive(new Resolvable({ startResolved: true }));
  userInput = ref<HTMLInputElement | null>(null);
  data = appData;

  constructor(
    public type: ChatType,
  ) {

    this.messages = findChat(type).messages;

  }

  private removeMessagesFrom(message: ChatMessage) {
    this.messages.splice(this.messages.indexOf(message), this.messages.length - this.messages.indexOf(message));
  }

  editMessage(message: ChatMessage<'user'>) {
    this.userMessage.value = message.content;
    this.removeMessagesFrom(message);
    nextTick(() => {
      this.userInput.value?.select();
    });
  }

  get lastMessageIsFromUser() {
    const lastMessage = _.last(this.messages);
    return lastMessage && isBy.user(lastMessage);
  }

  regenerate(message: ChatMessage<'assistant'>) {
    this.removeMessagesFrom(message);
  }

  sendMessage() {
    const content = this.userMessage.value;
    if (content.trim() !== '') {
      this.messages.push(says.user(content));
      this.userMessage.value = '';
    }
  }

  startOver() {
    if (window.confirm("Are you sure you want to start over? All current messages will be lost.")) {
      this.messages.splice(0, this.messages.length);
    }
  }

};

export const ChatController =
  mixinable(BaseChatController)
    .mixin(Monitorable)
    .mixin(QuoteHandler);
import _ from 'lodash';
import { UnwrapRef } from 'nuxt/dist/app/compat/capi';
import { Resolvable } from 'vovas-utils';
import { ChatMessage, isBy, says } from '~/lib/vovas-openai';
import { ChatType } from './types';
import { useLocalReactive } from 'use-vova';
import { username } from '../username';
import { Monitorable } from './monitor';
import { QuoteHandler } from './quotes';

export type Class<T> = new (...args: any[]) => T;

export class BaseChatController {

  messages: UnwrapRef<ChatMessage[]>;
  userMessage = ref('');
  generating = reactive(new Resolvable({ startResolved: true }));
  userInput = ref<HTMLInputElement | null>(null);
  username = username;

  constructor(
    public type: ChatType,
  ) {

    this.messages = useLocalReactive<ChatMessage[]>(`${type}Messages`, []);

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

export type ChatController = InstanceType<typeof BaseChatController> & InstanceType<ReturnType<typeof QuoteHandler>> & InstanceType<ReturnType<typeof Monitorable>>;

export function createChatController(...args: ConstructorParameters<typeof BaseChatController>) {
  const Class = Monitorable(
    QuoteHandler(
      BaseChatController
    )
  );
  return new Class(...args) as ChatController;
}
import _ from 'lodash';
import { UnwrapRef } from 'nuxt/dist/app/compat/capi';
import { Resolvable } from 'vovas-utils';
import { ChatMessage, isBy, says } from '~/lib/vovas-openai';
import { ChatType } from './types';
import { monitor } from './monitor';
import { useLocalReactive } from 'use-vova';
import { username } from '../username';
import { QuoteHandler } from './quotes';

export class ChatController {

  messages: UnwrapRef<ChatMessage[]>;
  userMessage = ref('');
  generating = reactive(new Resolvable({ startResolved: true }));
  userInput = ref<HTMLInputElement | null>(null);
  username = username;

  constructor(
    public type: ChatType,
  ) {

    this.messages = useLocalReactive<ChatMessage[]>(`${type}Messages`, []);

    monitor(this);

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

}

export interface ChatController extends QuoteHandler {}

applyMixins(ChatController, [ QuoteHandler ]);

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!);
    });
  });
}
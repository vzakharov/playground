import _ from 'lodash';
import { UnwrapRef } from 'nuxt/dist/app/compat/capi';
import { Resolvable } from 'vovas-utils';
import { ChatMessage, says } from '~/lib/vovas-openai';
import { ChatType } from './types';
import { monitor } from './monitor';
import { useLocalReactive } from 'use-vova';
import { username } from '../username';

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

  editMessage(message: ChatMessage) {
    this.userMessage.value = message.content ?? '';
    this.removeMessagesFrom(message);
    nextTick(() => {
      this.userInput.value?.select();
    });
  }

  get lastMessageIsFromUser() {
    const lastMessage = _.last(this.messages);
    return lastMessage && lastMessage.role === 'user';
  }

  regenerate(message: ChatMessage) {
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
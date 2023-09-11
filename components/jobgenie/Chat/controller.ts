import _ from 'lodash';
import { UnwrapRef } from 'nuxt/dist/app/compat/capi';
import { Resolvable } from 'vovas-utils';
import { ChatMessage, ChatRole, says } from '~/lib/vovas-openai';
import { ChatType } from './types';
import { monitor } from './monitor';
import { useLocalReactive } from 'use-vova';
import { username } from '../username';

export type ChatController = ReturnType<typeof createChatController>;

export function createChatController(type: ChatType) {

  const messages = useLocalReactive<ChatMessage[]>(`${type}Messages`, []);
  const userMessage = ref('');
  const generating = reactive(new Resolvable({ startResolved: true }));
  const userInput = ref<HTMLInputElement | null>(null);

  function removeMessagesFrom(message: ChatMessage) {
    messages.splice(messages.indexOf(message), messages.length - messages.indexOf(message));
  }

  monitor({ messages, generating, username, type });

  return {

    type, messages, userMessage, generating, userInput,

    editMessage(message: ChatMessage) {
      userMessage.value = message.content ?? '';
      removeMessagesFrom(message);
      nextTick(() => {
        userInput.value?.select();
      });
    },

    lastMessageIsFrom(role: ChatRole) {
      const lastMessage = _.last(messages);
      return !!lastMessage && lastMessage.role === role;
    },

    regenerate(message: ChatMessage) {
      removeMessagesFrom(message);
    },

    sendMessage() {
      const content = userMessage.value;
      if (content.trim() !== '') {
        messages.push(says.user(content));
        userMessage.value = '';
      }
    },

    startOver() {
      if (window.confirm("Are you sure you want to start over? All current messages will be lost.")) {
        messages.splice(0, messages.length);
      }
    },

  };

};
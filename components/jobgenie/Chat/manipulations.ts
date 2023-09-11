import _ from 'lodash';
import { ChatMessage, says } from '~/lib/vovas-openai';


export type MessageManipulationsParams = {
  userMessage: Ref<string>;
  userInput: Ref<HTMLInputElement | null>;
};

export function messageManipulations(messages: ChatMessage[], { userMessage, userInput }: MessageManipulationsParams) {

  function removeMessagesFrom(message: ChatMessage) {
    messages.splice(messages.indexOf(message), messages.length - messages.indexOf(message));
  }


  return {

    editMessage(message: ChatMessage) {
      userMessage.value = message.content ?? '';
      removeMessagesFrom(message);
      nextTick(() => {
        userInput.value?.select();
      });
    },

    lastMessageIsFromUser: computed(() => {
      const lastMessage = _.last(messages);
      return lastMessage && lastMessage.role === 'user';
    }),

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
  
}

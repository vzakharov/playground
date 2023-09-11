import _ from 'lodash';
import { ChatMessage, says } from '~/lib/vovas-openai';

export type MessageManipulationsParams = {
  userMessage: Ref<string>;
  userInput: Ref<HTMLInputElement | null>;
};

export class MessageManipulator {
  constructor(
    public messages: ChatMessage[], 
    public config: MessageManipulationsParams
  ) {}

  private removeMessagesFrom(message: ChatMessage) {
    this.messages.splice(this.messages.indexOf(message), this.messages.length - this.messages.indexOf(message));
  }

  editMessage(message: ChatMessage) {
    this.config.userMessage.value = message.content ?? '';
    this.removeMessagesFrom(message);
    nextTick(() => {
      this.config.userInput.value?.select();
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
    const content = this.config.userMessage.value;
    if (content.trim() !== '') {
      this.messages.push(says.user(content));
      this.config.userMessage.value = '';
    }
  }

  startOver() {
    if (window.confirm("Are you sure you want to start over? All current messages will be lost.")) {
      this.messages.splice(0, this.messages.length);
    }
  }
}
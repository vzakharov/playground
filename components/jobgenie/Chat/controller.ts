import _, { create } from 'lodash';
import { Resolvable, mixinable } from 'vovas-utils';
import { AppChatMessage, ChatType, findBy } from '~/lib/jobgenie';
import { isBy, says } from '~/lib/vovas-openai';
import { findOrCreateChat } from '../data';
import { ChatResponder } from './responder';

export class BaseChatController<T extends ChatType> {

  userMessage = ref('');
  generating = reactive(new Resolvable({ startResolved: true }));
  userInput = ref<HTMLInputElement | null>(null);
  msExpected = ref<number | null>(null);

  constructor(
    public type: T,
    public chat = findOrCreateChat(type),
    public messages = chat.messages,
  ) {}

  private removeMessagesFrom(message: AppChatMessage<T>) {
    this.messages.splice(this.messages.indexOf(message), this.messages.length - this.messages.indexOf(message));
  }

  editMessage(message: AppChatMessage<T, 'user'>) {
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

  regenerate(message: AppChatMessage<T, 'assistant'>) {
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

export function createChatController<T extends ChatType>(type: T) {
  return mixinable(BaseChatController<T>)
    .mixin(ChatResponder)
    .create(type);
}

export type ChatController<T extends ChatType> = ReturnType<typeof createChatController<T>>;

export const activeChatControllers: ChatController<any>[] = reactive([]);

export function getOrCreateChatController<T extends ChatType>(type: T) {
  const chatController = findBy({ type }, activeChatControllers);
  if (chatController) {
    console.log({ chatController });
    return chatController as ChatController<T>;
  } else {
    const newChatController = createChatController(type);
    console.log({ newChatController });
    activeChatControllers.push(newChatController);
    return newChatController;
  }
}
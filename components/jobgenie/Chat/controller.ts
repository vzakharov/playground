import _, { create } from 'lodash';
import { Resolvable, forEach, mixinable } from 'vovas-utils';
import { AppChat, AppChatMessage, ChatType, defaultData, findBy } from '~/lib/jobgenie';
import { isBy, says } from '~/lib/vovas-openai';
import { data, findOrCreateChat } from '../data';
import { ChatResponder } from './responder';
import { dataLastLoaded, state, userInput, userMessage } from '../refs';
import { exportData } from '../exportImport';
import { LeftoverHandler } from './leftoverHandler';

export class BaseChatController<T extends ChatType> {


  constructor(
    public type: T,
    public messages = findOrCreateChat(type).messages
  ) { 
    // debugger
  }


  private removeMessagesFrom(message: AppChatMessage<T>) {
    this.messages.splice(this.messages.indexOf(message), this.messages.length - this.messages.indexOf(message));
  }

  editMessage(message: AppChatMessage<T, 'user'>) {
    userMessage.value = message.content;
    this.removeMessagesFrom(message);
    nextTick(() => {
      userInput.value?.select();
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
    const content = userMessage.value;
    if (content.trim() !== '') {
      this.messages.push(says.user(content));
      userMessage.value = '';
    }
  }

  startOver() {
    if (window.confirm("Are you sure you want to start over? All current data will be lost.")) {
      // exportData();
      forEach(data, (value, key) => {
        data[key] = defaultData[key];
      });
      dataLastLoaded.value = Date.now();
      // debugger
    }
  }

};

export function createChatController<T extends ChatType>(type: T) {
  return mixinable(BaseChatController<T>)
    .mixin(ChatResponder)
    .mixin(LeftoverHandler)
    .create(type);
}

export type ChatController<T extends ChatType> = ReturnType<typeof createChatController<T>>;

export const activeChatControllers: ChatController<any>[] = reactive([]);
console.log({ activeChatControllers })

export function renewChatController<T extends ChatType>(type: T) {
  const chatController = findBy({ type }, activeChatControllers);
  if (chatController) {
    console.log("Deleting old chat controller:", chatController);
    _.pull(activeChatControllers, chatController);
  };
  const newChatController = createChatController(type);
  console.log("Creating new chat controller:", newChatController);
  activeChatControllers.push(newChatController);
  return newChatController;
}
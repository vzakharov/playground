import _ from 'lodash';
import { forEach, mixinable } from 'vovas-utils';
import { AppChatMessage, ChatType, defaultData, findBy, says, setValue } from '~/lib/jobgenie';
import { isBy } from '~/lib/vovas-openai';
import { data, findOrCreateChat } from '../data';
import { dataLastLoaded, generating, userMessage } from '../refs';
import { sectionConfigs } from '../sections';
import { state } from '../state';
import { LeftoverHandler } from './leftoverHandler';
import { ChatResponder } from './responder';

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
    setValue(userMessage, message.content);
    this.removeMessagesFrom(message);
    if ( generating.value?.inProgress ) {
      // generating.value.reject(new GenerationCanceledException("Generation canceled"));
      generating.value.cancel();
    };
    nextTick(() => {
      // userMessageComponent.value?.textarea?.select();
      const textarea = window.document.getElementById('userMessage');
      if ( !(textarea instanceof HTMLTextAreaElement ) ) return;
      textarea.select();
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
      setValue(userMessage, '');
    }
  }

  startOver() {
    if (window.confirm("Are you sure you want to start over? All current data will be lost.")) {
      // exportData();
      forEach(data, (value, key) => {
        data[key] = defaultData[key];
      });
      state.selectedSectionId = sectionConfigs[0].id;
      setValue(dataLastLoaded, Date.now());
    }
  }

};

export function createChatController<T extends ChatType>(...args: ConstructorParameters<typeof BaseChatController<T>>) {
  return mixinable(BaseChatController<T>)
    .mixin(ChatResponder)
    .mixin(LeftoverHandler)
    .create(...args);
}

export type ChatController<T extends ChatType> = ReturnType<typeof createChatController<T>>;

export const activeChatControllers: ChatController<any>[] = reactive([]);
console.log({ activeChatControllers })

export function renewChatController<T extends ChatType>(...args: ConstructorParameters<typeof BaseChatController<T>>) {
  const [ type ] = args;
  const chatController = findBy({ type }, activeChatControllers);
  if (chatController) {
    console.log("Deleting old chat controller:", chatController);
    _.pull(activeChatControllers, chatController);
  };
  const newChatController = createChatController(...args);
  console.log("Creating new chat controller:", newChatController);
  activeChatControllers.push(newChatController);
  return newChatController;
}

export function removeChatController(chatController: ChatController<any>) {
  _.pull(activeChatControllers, chatController);
}
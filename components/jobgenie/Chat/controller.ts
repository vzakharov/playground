import _ from 'lodash';
import { forEach } from 'vovas-utils';
import { AppChatMessage, ChatType, defaultData, findBy, says, setValue } from '~/lib/jobgenie';
import { isBy } from '~/lib/vovas-openai';
import { data, findOrCreateChat } from '../data';
import { dataLastLoaded, generating, userMessage } from '../refs';
import { sectionConfigs } from '../sections';
import { state } from '../state';
import { LeftoverHandler } from './leftoverHandler';

export class BaseChatController<T extends ChatType> {

  constructor(
    public type: T,
    public messages = findOrCreateChat(type).messages
  ) { }


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

export class ChatController<T extends ChatType> extends LeftoverHandler<T> { }

export const activeChatControllers: ChatController<any>[] = reactive([]);

export function renewChatController<T extends ChatType>(...args: ConstructorParameters<typeof BaseChatController<T>>) {
  const [ type ] = args;
  const oldController = findBy({ type }, activeChatControllers);
  if (oldController) {
    console.log("Deleting old chat controller:", oldController);
    _.pull(activeChatControllers, oldController);
  };
  // const newChatController = createChatController(...args);
  const newController = new ChatController(...args);
  console.log("Creating new chat controller:", newController);
  activeChatControllers.push(newController);
  return newController;
}

export function removeChatController(chatController: ChatController<any>) {
  _.pull(activeChatControllers, chatController);
}
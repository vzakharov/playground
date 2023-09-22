import _ from 'lodash';
import { forEach } from 'vovas-utils';
import { ToRefs } from 'vue';
import { AppChatMessage, ChatType, Resolvable, defaultData, findBy, says, toReactive } from '~/lib/jobgenie';
import { isBy } from '~/lib/vovas-openai';
import { data, findOrCreateChat } from '../data';
// import { dataLastLoaded, generating, userMessage } from '../refs';
import { sectionConfigs } from '../sections';
import { globalState } from '../state';
import { handleResponseGeneration } from './responder/handleResponseGeneration';
import { watchForResponseGeneration } from './responder/watchForResponseGeneration';
import { cycleLeftovers } from './cycleLeftovers';

export type ChatControllerState<T extends ChatType> = {
  dataLastLoaded: number;
  generating: Resolvable<AppChatMessage<T, 'assistant'>> | undefined;
  userMessage: string;
  msExpected: number | undefined;
};

// export class BaseChatController<T extends ChatType, S extends BaseChatControllerState<T>> {

//   constructor(
//     public type: T,
//     refs: ToRefs<S>,
//   ) { 
//     this.state = toReactive(refs),
//     this.messages = findOrCreateChat(type).messages
//   }

export function createChatController<T extends ChatType>(type: T, refs: ToRefs<ChatControllerState<T>>) {

  // state: UnwrapRefs<ToRefs<S>>;
  // messages: AppChatMessage<T>[];

  const c = {

    type,
    state: toReactive(refs) as ChatControllerState<T>,
    messages: findOrCreateChat(type).messages,

    removeMessagesFrom(message: AppChatMessage<T>) {
      c.messages.splice(c.messages.indexOf(message), c.messages.length - c.messages.indexOf(message));
    },

    editMessage(message: AppChatMessage<T, 'user'>) {
      const { state, state: { generating } } = c;
      state.userMessage = message.content;
      c.removeMessagesFrom(message);
      if (generating?.inProgress) {
        generating.cancel();
      }
      nextTick(() => {
        // userMessageComponent.value?.textarea?.select();
        const textarea = window.document.getElementById('userMessage');
        if (!(textarea instanceof HTMLTextAreaElement)) return;
        textarea.select();
      });
    },

    get lastMessageIsFromUser() {
      const lastMessage = _.last(c.messages);
      return lastMessage && isBy.user(lastMessage);
    },

    regenerate(message: AppChatMessage<T, 'assistant'>) {
      c.removeMessagesFrom(message);
    },

    sendMessage() {
      const { state } = c;
      const content = state.userMessage.trim();
      if (content.trim() !== '') {
        c.messages.push(says.user(content));
        state.userMessage = '';
      }
    },

    startOver() {
      if (window.confirm("Are you sure you want to start over? All current data will be lost.")) {
        // exportData();
        forEach(data, (value, key) => {
          data[key] = defaultData[key];
        });
        globalState.selectedSectionId = sectionConfigs[0].id;
        c.state.dataLastLoaded = Date.now();
      }
    },

    watchForResponseGeneration,
    handleResponseGeneration,
    cycleLeftovers

  };

  c.watchForResponseGeneration();

  return c;

};

export type ChatController<T extends ChatType> = ReturnType<typeof createChatController<T>>;

// export class ChatController<T extends ChatType> extends LeftoverHandler<T> { }

export const activeChatControllers: ChatController<any>[] = reactive([]);

// export function renewChatController<T extends ChatType>(...args: ConstructorParameters<typeof BaseChatController<T>>) {
export function renewChatController<T extends ChatType>(...args: Parameters<typeof createChatController<T>>) {
  const [type] = args;
  const oldController = findBy({ type }, activeChatControllers);
  if (oldController) {
    console.log("Deleting old chat controller:", oldController);
    _.pull(activeChatControllers, oldController);
  };
  const newController = createChatController(...args);
  // const newController = new ChatController(...args);
  console.log("Creating new chat controller:", newController);
  activeChatControllers.push(newController);
  return newController;
}

export function removeChatController(chatController: ChatController<any>) {
  _.pull(activeChatControllers, chatController);
}
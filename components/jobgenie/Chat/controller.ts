import _ from 'lodash';
import { ToRefs } from 'vue';
import { AppChatMessage, ChatType, Resolvable, findBy, says, toReactive } from '~/lib/jobgenie';
import { isBy } from '~/lib/vovas-openai';
import { findOrCreateChat } from '../data';
// import { dataLastLoaded, generating, userMessage } from '../refs';
import Textarea from '~/components/shared/TextareaScript';
import { cycleLeftovers } from './cycleLeftovers';
import { editMessage } from './editMessage';
import { handleResponseGeneration } from './responder/handleResponseGeneration';
import { watchForResponseGeneration } from './responder/watchForResponseGeneration';

export type ChatControllerState<T extends ChatType> = {
  generating: Resolvable<AppChatMessage<T, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: InstanceType<typeof Textarea> | undefined;
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

  const c = {

    type,
    state: toReactive(refs) as ChatControllerState<T>,
    messages: findOrCreateChat(type).messages,
    previousGeneration: undefined as AppChatMessage<T, 'assistant'> | undefined,

    get lastMessageIsFromUser() {
      const lastMessage = _.last(c.messages);
      return lastMessage && isBy.user(lastMessage);
    },

    removeMessagesFrom(message: AppChatMessage<T>) {
      c.messages.splice(c.messages.indexOf(message), c.messages.length - c.messages.indexOf(message));
    },

    editMessage,

    regenerate(message: AppChatMessage<T, 'assistant'>) {
      c.previousGeneration = message;
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
import _ from 'lodash';
import { ToRefs } from 'vue';
import { ChatType, JobGenieMessage, Resolvable, toReactive } from '~/lib/jobgenie';
import { isBy } from '~/lib/vovas-openai';
import { findOrCreateChat } from "../findOrCreateChat";
// import { dataLastLoaded, generating, userMessage } from '../refs';
import Textarea from '~/components/shared/TextareaScript';
import { GenieMessage, findBy, says } from '~/lib/genie';
import { editMessage } from './editMessage';
import { cycleLeftovers, deleteLeftover } from './leftovers';
import { countIrrelevantMessages, isRelevant } from './relevantMessages';
import { handleResponseGeneration } from './responder/handleResponseGeneration';
import { watchForResponseGeneration } from './responder/watchForResponseGeneration';

export type ChatControllerState<A extends string> = {
  generating: Resolvable<GenieMessage<A, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: InstanceType<typeof Textarea> | undefined;
  msExpected: number | undefined;
};

export function createChatController<T extends ChatType>(type: T, id: string, refs: ToRefs<ChatControllerState<T>>) {

  const c = {

    type,
    state: toReactive(refs) as ChatControllerState<T>,
    messages: findOrCreateChat(type, id).messages,
    previousGeneration: undefined as JobGenieMessage<T, 'assistant'> | undefined,

    get lastMessageIsFromUser() {
      const lastMessage = _.last(c.messages);
      return lastMessage && isBy.user(lastMessage);
    },

    removeMessagesFrom(message: JobGenieMessage<T>) {
      c.messages.splice(c.messages.indexOf(message), c.messages.length - c.messages.indexOf(message));
    },

    editMessage,

    regenerate(message: JobGenieMessage<T, 'assistant'>) {
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
    
    cycleLeftovers,
    deleteLeftover,

    countIrrelevantMessages,
    isRelevant,

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
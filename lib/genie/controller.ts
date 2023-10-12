import _ from 'lodash';
import { ToRefs } from 'vue';
import { toReactive } from '~/lib/utils';
import { isBy } from '~/lib/vovas-openai';
import { GenieData, GenieMessage, Resolvable, findBy, findOrCreateChat, says } from '.';

export type ChatControllerState<AK extends string> = {
  generating: Resolvable<GenieMessage<AK, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: {
    textarea?: HTMLTextAreaElement;
  } | undefined;
  msExpected: number | undefined;
};

export function createChatController<Ts extends string, T extends Ts, AK extends string>(
  data: GenieData<Ts>,
  type: T,
  id: string,
  refs: ToRefs<ChatControllerState<AK>>
) {

  const c = {
    type,
    state: toReactive(refs) as ChatControllerState<AK>,
    messages: findOrCreateChat(data, type, id ).messages,
    previousGeneration: undefined as GenieMessage<AK, 'assistant'> | undefined,

    get lastMessageIsFromUser() {
      const lastMessage = _.last(c.messages);
      return lastMessage && isBy.user(lastMessage);
    },

    removeMessagesFrom(message: GenieMessage<AK>) {
      c.messages.splice(c.messages.indexOf(message), c.messages.length - c.messages.indexOf(message));
    },

    editMessage,

    regenerate(message: GenieMessage<AK, 'assistant'>) {
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

// export type ChatController<T extends ChatType> = ReturnType<typeof createChatController<T>>;

export type ChatController<Ts extends string, T extends Ts, AK extends string> = ReturnType<typeof createChatController<Ts, T, AK>>;

export type AnyChatController = ChatController<string, string, string>;

export const activeChatControllers = reactive<AnyChatController[]>([]);

export function renewChatController<Ts extends string, T extends Ts, AK extends string>(
  ...args: Parameters<typeof createChatController<Ts, T, AK>>
) {
  const [, type, id] = args;
  const oldController = findBy({ type, id }, activeChatControllers);
  if (oldController) {
    console.log("Deleting old chat controller:", oldController);
    _.pull(activeChatControllers, oldController);
  };
  const newController = createChatController(...args);
  console.log("Creating new chat controller:", newController);
  activeChatControllers.push(newController);
  return newController;
}

export function removeChatController(chatController: AnyChatController) {
  _.pull(activeChatControllers, chatController);
}
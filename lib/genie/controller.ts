import _ from 'lodash';
import { ToRefs } from 'vue';
import { toReactive } from '~/lib/utils';
import { isBy } from '~/lib/vovas-openai';
import { AssetName, ChatId, GenieChat, GenieChatType, GenieData, GenieMessage, GenieState, Resolvable, cycleLeftovers, replaceWithLeftover, editMessage, findBy, findOrCreateChat, getLeftovers, handleResponseGeneration, says, watchForResponseGeneration } from '.';

export type ChatControllerState<A extends AssetName> = {
  generating: Resolvable<GenieMessage<A, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: {
    textarea?: HTMLTextAreaElement;
  } | undefined;
  msExpected: number | undefined;
};

export type ChatControllerConfig<T extends GenieChatType, A extends AssetName> = {
  data: GenieData<GenieChatType>;
  globalState: GenieState;
  type: T;
  chatId: ChatId;
  refs: ToRefs<ChatControllerState<A>>;
};

export function createChatController<T extends GenieChatType, A extends AssetName>({
  data, globalState, type, chatId, refs,
}: ChatControllerConfig<T, A>) {

  const chat = findOrCreateChat(data, type, chatId ) as GenieChat<T, A>;
  const { messages } = chat;

  const c = {
    type,
    chat,
    globalState,
    state: toReactive(refs) as ChatControllerState<A>,
    messages,
    previousGeneration: undefined as GenieMessage<A, 'assistant'> | undefined,

    get lastMessageIsFromUser() {
      const lastMessage = _.last(c.messages);
      return lastMessage && isBy.user(lastMessage);
    },

    removeMessagesFrom(message: GenieMessage<A>) {
      c.messages.splice(c.messages.indexOf(message), c.messages.length - c.messages.indexOf(message));
    },

    editMessage,

    regenerate(message: GenieMessage<A, 'assistant'>) {
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

    getLeftovers,
    cycleLeftovers,
    replaceWithLeftover,

    countIrrelevantMessages,
    isRelevant,
  };

  c.watchForResponseGeneration();

  return c;

};

export type ChatController<T extends GenieChatType, A extends AssetName> = ReturnType<typeof createChatController<T, A>>;

export type AnyChatController = ChatController<GenieChatType, AssetName>;

export const activeChatControllers = reactive<AnyChatController[]>([]);

export function renewChatController<T extends GenieChatType, A extends AssetName>(
  ...args: Parameters<typeof createChatController<T, A>>
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
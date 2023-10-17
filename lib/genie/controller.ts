import _ from 'lodash';
import { ToRefs } from 'vue';
import { Resolvable, mixin, toReactive } from '~/lib/utils';
import { isBy } from '~/lib/vovas-openai';
import { AssetName, ChatId, GenieChat, GenieChatType, GenieData, GenieMessage, GenieState, PromptBuilder, ResponderMixinConfig, editMessage, findBy, findOrCreateChat, leftoversMixin, responderMixin, says } from '.';

export type ChatControllerState<A extends AssetName> = {
  generating: Resolvable<GenieMessage<A, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: {
    textarea?: HTMLTextAreaElement;
  } | undefined;
  msExpected: number | undefined;
};

export type BaseChatControllerConfig<T extends GenieChatType, A extends AssetName> = {
  data: GenieData<GenieChatType>;
  globalState: GenieState;
  type: T;
  chatId: ChatId;
  refs: ToRefs<ChatControllerState<A>>;
  promptBuilder: PromptBuilder<T, any, any>;
  autoMessage?: ( data: GenieData<GenieChatType> ) => GenieMessage<A, 'assistant'>;
};

export function createBaseChatController<T extends GenieChatType, A extends AssetName>(
  {
    data, globalState, type, chatId, refs, autoMessage
  }: BaseChatControllerConfig<T, A>
) {

  const chat = findOrCreateChat(data, type, chatId ) as GenieChat<T, A>;
  const { messages } = chat;

  const c = {
    type,
    chat,
    data,
    globalState,
    autoMessage,
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

    // countIrrelevantMessages,
    // isRelevant,
    
  };

  // c.watchForResponseGeneration();

  return c;

};

export type BaseChatController<T extends GenieChatType, A extends AssetName> = ReturnType<typeof createBaseChatController<T, A>>;

export type ChatControllerConfig<T extends GenieChatType, A extends AssetName> = 
  BaseChatControllerConfig<T, A> 
  & ResponderMixinConfig;

export function createChatController<T extends GenieChatType, A extends AssetName>(
  config: ChatControllerConfig<T, A>
) {
  const controller = mixin(
    mixin(
      createBaseChatController(config),
      leftoversMixin,
    ),
    responderMixin(config)
  );
  controller.watchForResponseGeneration();
  return controller;
};

export type ChatController<T extends GenieChatType, A extends AssetName> = ReturnType<typeof createChatController<T, A>>;

type Test = ChatController<GenieChatType, AssetName>['watchForResponseGeneration'];

export type AnyChatController = ChatController<GenieChatType, AssetName>;

export const activeChatControllers = reactive<AnyChatController[]>([]);

export function renewChatController<T extends GenieChatType, A extends AssetName>(
  config: ChatControllerConfig<T, A>
): ChatController<T, A> {
  const { type, chatId } = config;
  const oldController = findBy({ type, chatId }, activeChatControllers);
  if (oldController) {
    console.log("Deleting old chat controller:", oldController);
    _.pull(activeChatControllers, oldController);
  };
  const newController = createChatController(config);
  console.log("Creating new chat controller:", newController);
  activeChatControllers.push(newController);
  return newController;
}

export function removeChatController(chatController: AnyChatController) {
  _.pull(activeChatControllers, chatController);
}
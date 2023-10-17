import _ from 'lodash';
import { ToRefs } from 'vue';
import { Resolvable, toReactive } from '~/lib/utils';
import { isBy } from '~/lib/vovas-openai';
import {
  AssetName, ChatId, GenieChat, GenieChatType, GenieData, GenieMessage, GenieState, PromptBuilder, Responder, editMessage, findBy, findOrCreateChat, says
} from '.';

export type ChatControllerState<A extends AssetName> = {
  generating: Resolvable<GenieMessage<A, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: {
    textarea?: HTMLTextAreaElement;
  } | undefined;
  msExpected: number | undefined;
};

export type BaseChatControllerConfig<
  Ts extends GenieChatType, 
  T extends Ts, 
  A extends AssetName
> = {
  data: GenieData<Ts>;
  globalState: GenieState;
  type: T;
  chatId: ChatId;
  state: ChatControllerState<A>;
  promptBuilder: PromptBuilder<T, any, any>;
  autoMessage?: ( data: GenieData<Ts> ) => GenieMessage<A, 'assistant'>;
};

export class BaseChatController<  
  Ts extends GenieChatType, 
  T extends Ts, 
  A extends AssetName
> {

  constructor(
    public readonly config: BaseChatControllerConfig<Ts, T, A>
  ) {
    this.chat = findOrCreateChat(config.data, config.type, config.chatId );
    this.messages = this.chat.messages;
  };

  readonly chat: GenieChat<T, A>;
  readonly messages: GenieMessage<A>[];
  previousGeneration?: GenieMessage<A, 'assistant'>;

  get lastMessageIsFromUser() {
    const { messages } = this;
    const lastMessage = _.last(messages);
    return lastMessage && isBy.user(lastMessage);
  };

  removeMessagesFrom(message: GenieMessage<A>) {
    const { messages } = this;
    messages.splice(messages.indexOf(message), messages.length - messages.indexOf(message));
  };

  editMessage = editMessage;

  regenerate(message: GenieMessage<A, 'assistant'>) {
    this.previousGeneration = message;
    this.removeMessagesFrom(message);
  };

  sendMessage() {
    const { messages, config: { state }} = this;
    const content = state.userMessage.trim();
    if (content.trim() !== '') {
      messages.push(says.user(content));
      state.userMessage = '';
    }
  };

  // countIrrelevantMessages,
  // isRelevant,
    
};

export class ChatController<Ts extends GenieChatType, T extends Ts, A extends AssetName> 
  extends Responder<Ts, T, A> { };

export type ChatControllerConfig<Ts extends GenieChatType, T extends Ts, A extends AssetName> = 
  ConstructorParameters<typeof ChatController<Ts, T, A>>[0];

export type AnyChatController = ChatController<GenieChatType, GenieChatType, AssetName>;

export const activeChatControllers = reactive<AnyChatController[]>([]);
activeChatControllers[0].config.type

export function renewChatController<Ts extends GenieChatType, T extends Ts, A extends AssetName>(
  config: ChatControllerConfig<Ts, T, A>
) {
  const { type, chatId } = config;
  const oldController = findBy({ config: { type, chatId }}, activeChatControllers);
  if (oldController) {
    console.log("Deleting old chat controller:", oldController);
    _.pull(activeChatControllers, oldController);
  };
  const newController = new ChatController(config);
  console.log("Creating new chat controller:", newController);
  activeChatControllers.push(newController as AnyChatController);
  return newController;
}

export function removeChatController(chatController: AnyChatController) {
  _.pull(activeChatControllers, chatController);
}
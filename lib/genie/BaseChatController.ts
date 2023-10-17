import _ from 'lodash';
import { isBy } from '~/lib/vovas-openai';
import { AssetName, ChatId, GenieChat, GenieChatType, GenieData, GenieMessage, GenieState, PromptBuilder, editMessage, findOrCreateChat, says } from '.';
import { ChatControllerState } from './ChatController';


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
  autoMessage?: (data: GenieData<Ts>) => GenieMessage<A, 'assistant'>;
};

export class BaseChatController<
  Ts extends GenieChatType,
  T extends Ts,
  A extends AssetName
> {

  constructor(
    public readonly config: BaseChatControllerConfig<Ts, T, A>
  ) {
    this.chat = findOrCreateChat(config.data, config.type, config.chatId);
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
    const { messages, config: { state } } = this;
    const content = state.userMessage.trim();
    if (content.trim() !== '') {
      messages.push(says.user(content));
      state.userMessage = '';
    }
  };

}
;

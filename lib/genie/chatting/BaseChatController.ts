import _ from 'lodash';
import { isBy } from '~/lib/vovas-openai';
import { ChatId, GenieChat, GenieData, GenieMessage, GenieState, PromptBuilder, GenieSchema, Tool, editMessage, findOrCreateChat, says } from '..';
import { ChatControllerState } from './ChatController';


export type BaseChatControllerConfig<
  S extends GenieSchema,
  T extends Tool<S>,
> = {
  tool: T;
  data: GenieData<S>;
  state: ChatControllerState<S, T>;
  globalState: GenieState<S>;
  chatId: ChatId;
  promptBuilder: PromptBuilder<S, T, any>;
  autoMessage?: (data: GenieData<S>) => GenieMessage<S, T, 'assistant'>;
};

export class BaseChatController<
  S extends GenieSchema,
  T extends Tool<S>,
> {

  constructor(
    public readonly config: BaseChatControllerConfig<S, T>,
  ) {
    const { config: { data, tool, chatId } } = this;
    this.chat = findOrCreateChat(data, tool, chatId);
    this.messages = this.chat.messages;
  };

  readonly chat: GenieChat<S, T>;
  readonly messages: GenieMessage<S, T>[];
  previousGeneration?: GenieMessage<S, T, 'assistant'>;

  get lastMessageIsFromUser() {
    const { messages } = this;
    const lastMessage = _.last(messages);
    return lastMessage && isBy.user(lastMessage);
  };

  removeMessagesFrom(message: GenieMessage<S, T>) {
    const { messages } = this;
    messages.splice(messages.indexOf(message), messages.length - messages.indexOf(message));
  };

  editMessage = editMessage;

  regenerate(message: GenieMessage<S, T, 'assistant'>) {
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

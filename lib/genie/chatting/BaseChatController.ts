import _ from 'lodash';
import { isBy } from '~/lib/vovas-openai';
import { ChatId, GenieChat, GenieData, GenieMessage, GenieState, Tool, GenieSchema, ToolName, editMessage, findOrCreateChat, says, Toolset, ChatControllerState, ToolFrom, AnyTool, MinimumToolset } from '..';


export type BaseChatControllerConfig<
  T extends AnyTool,
  S extends MinimumToolset<T> = MinimumToolset<T>,
> = {
  tool: T;
  data: GenieData<S>;
  state: ChatControllerState<S, T>;
  globalState: GenieState<S>;
  chatId: ChatId;
  autoMessage?: (data: GenieData<S>) => GenieMessage<T, 'assistant'>;
};

export class BaseChatController<
  S extends Toolset,
  T extends ToolFrom<S>,
> {

  constructor(
    public readonly config: BaseChatControllerConfig<S, T>,
  ) {
    this.config.tool.id
    const { config: { data, tool, chatId } } = this;
    this.chat = findOrCreateChat(data, tool, chatId);
    this.messages = this.chat.messages;
  };

  readonly chat: GenieChat<T>;
  readonly messages: GenieMessage<T>[];
  previousGeneration?: GenieMessage<T, 'assistant'>;

  get lastMessageIsFromUser() {
    const { messages } = this;
    const lastMessage = _.last(messages);
    return lastMessage && isBy.user(lastMessage);
  };

  removeMessagesFrom(message: GenieMessage<T>) {
    const { messages } = this;
    messages.splice(messages.indexOf(message), messages.length - messages.indexOf(message));
  };

  editMessage = editMessage;

  regenerate(message: GenieMessage<T, 'assistant'>) {
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

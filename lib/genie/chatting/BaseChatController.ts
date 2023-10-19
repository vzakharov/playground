import _ from 'lodash';
import { isBy } from '~/lib/vovas-openai';
import { ChatId, GenieChat, GenieData, GenieMessage, GenieState, Tool, GenieSchema, ToolName, editMessage, findOrCreateChat, says, Toolset, ChatControllerState, ToolFrom, AnyTool, SetFor } from '..';


export type BaseChatControllerConfig<
  Id extends string,
  T extends AnyTool<Id>,
> = {
  tool: T;
  data: GenieData<SetFor<T>>;
  state: ChatControllerState<T>;
  globalState: GenieState<SetFor<T>>;
  chatId: ChatId;
  autoMessage?: (data: GenieData<SetFor<T>>) => GenieMessage<T, 'assistant'>;
};

export class BaseChatController<
  Id extends string,
  T extends AnyTool<Id>,
> {

  constructor(
    public readonly config: BaseChatControllerConfig<Id, T>,
  ) {
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

import _ from 'lodash';
import { filter } from '~/lib/utils';
import { isBy } from '~/lib/vovas-openai';
import { AnyTool, ChatState, ChatData, ChatId, GenieConfig, GenieData, GenieMessage, LeftoversDefined, SetFor, countIrrelevantMessages, editMessage, findOrCreateChat, isRelevant, says, GenieState } from '..';


export type BaseChatConfig<
  T extends AnyTool,
  GD extends GenieData<SetFor<T>>,
  GS extends GenieState
> = {
  tool: T;
  state: ChatState<T>;
  chatId: ChatId;
} & GenieConfig<SetFor<T>, GD, GS>;

export class BaseChat<
  T extends AnyTool,
  LD extends LeftoversDefined,
  GD extends GenieData<SetFor<T>>,
  GS extends GenieState
> {

  constructor(
    public readonly config: BaseChatConfig<T, GD, GS>,
  ) {
    const { config: { globalData, tool, chatId } } = this;
    this.data = findOrCreateChat(globalData, tool, chatId) as this['data'];
    this.messages = this.data.messages;
  };

  readonly data: ChatData<T, LD>;
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
  
  get messageWithActiveAssets(): GenieMessage<T, 'assistant'> | undefined {

    return _(filter(isBy.assistant)(this.messages))
      .filter(m => !!m.assets)
      .sortBy(m => m.assetsPickedAt ?? 0)
      .last();

  };

  isRelevant = isRelevant;

};

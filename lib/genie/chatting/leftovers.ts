import { $throw } from "vovas-utils";
import { AssetName, BaseChatController, ChatId, GenieMessage, MessageId, GenieSchema, ToolName, AnyTool, Toolset, ToolWithId, ToolFrom, ToolIdFrom } from "..";

export function getDefaultLeftovers<T extends AnyTool>(tool: T) {
  return {
    results: [] as GenieMessage<T, 'assistant'>[],
    baseId: null as MessageId | null,
    activeMessageOriginalIndex: 1,
  }
};

export type Leftovers<T extends AnyTool> = ReturnType<typeof getDefaultLeftovers<T>>;

export type LeftoversStore<S extends Toolset> = {
  [TId in ToolIdFrom<S>]?: {
    [CId in ChatId]?: Leftovers<ToolWithId<S, TId>>;
  };
};

export class LeftoversController<
  S extends GenieSchema,
  T extends ToolName<S>
> extends BaseChatController<S, T> {

  private store = this.config.globalState.leftoversStore;

  get defaultLeftovers() { return getDefaultLeftovers(this); };

  get leftovers() {
    const { store, chat, defaultLeftovers } = this;
    return store[chat.id] ??= defaultLeftovers;
  };

  set leftovers( value: Leftovers<S, T> ) {
    const { store, chat } = this;
    store[chat.id] = value;
  };

  areLeftoversForMessage(
    message: GenieMessage<S, T, 'assistant'>
  ) {

    const { leftovers } = this;

    return !!message.id && (leftovers.baseId === message.id);

  };

  replaceActiveMessageWithLeftover(
    message: GenieMessage<S, T, 'assistant'>
  ) {

    const { leftovers, messages } = this;

    if (!this.areLeftoversForMessage(message))
      throw new Error('Leftovers are not for this message');

    const { results } = leftovers;

    const leftover = results.shift()
      ?? $throw('No leftovers left');

    leftovers.baseId = leftover.id;

    messages.splice(messages.indexOf(message), 1, leftover);

    return { deletedMessage: message, leftovers };

  };

  cycleLeftovers(
    message: GenieMessage<S, T, 'assistant'>
  ) {

    const {
      deletedMessage,
      leftovers,
      leftovers: { activeMessageOriginalIndex, results }
    } = this.replaceActiveMessageWithLeftover(message);

    results.push(deletedMessage);

    leftovers.activeMessageOriginalIndex = (activeMessageOriginalIndex % (results.length + 1)) + 1;

  };

};
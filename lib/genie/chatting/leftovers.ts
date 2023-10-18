import { $throw } from "vovas-utils";
import { Asset, BaseChatController, ChatId, GenieMessage, MessageId, GenieSchema, Tool } from "..";

export function getDefaultLeftovers<S extends GenieSchema, T extends Tool<S>>(controller: LeftoversController<S, T>) {
  return {
    results: [] as GenieMessage<S, T, 'assistant'>[],
    baseId: null as MessageId | null,
    activeMessageOriginalIndex: 1,
  }
};

export type Leftovers<S extends GenieSchema, T extends Tool<S>> = ReturnType<typeof getDefaultLeftovers<S, T>>;

export type LeftoversStore<S extends GenieSchema> = {
  [T in Tool<S>]?: {
    [id in ChatId]?: Leftovers<S, T>
  };
};

export class LeftoversController<
  S extends GenieSchema,
  T extends Tool<S>
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
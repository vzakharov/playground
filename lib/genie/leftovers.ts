import { $throw } from "vovas-utils";
import { AssetName, BaseChatController, ChatId, GenieChat, GenieChatType, GenieMessage, MessageId } from ".";

export type Leftovers<A extends AssetName> = {
  results: GenieMessage<A, 'assistant'>[];
  baseId: MessageId | null;
  activeMessageOriginalIndex: number;
};

export const defaultLeftovers: Leftovers<AssetName> = {
  results: [],
  baseId: null,
  activeMessageOriginalIndex: 1,
};

export type LeftoversStore = {
  [id in ChatId]?: Leftovers<AssetName>
};

export class LeftoversController<
  Ts extends GenieChatType, 
  T extends Ts, 
  A extends AssetName
> extends BaseChatController<Ts, T, A> {

  private store = this.config.globalState.leftoversStore;

  get leftovers() {
    const { store, chat } = this;
    return store[chat.id] ??= defaultLeftovers;
  };


  set leftovers( value: Leftovers<A> ) {
    const { store, chat } = this;
    store[chat.id] = value;
  };

  areForMessage(
    message: GenieMessage<A, 'assistant'>
  ) {

    const { leftovers } = this;

    return !!message.id && (leftovers.baseId === message.id);

  };

  replaceWithLeftover(
    message: GenieMessage<A, 'assistant'>
  ) {

    const { leftovers, messages } = this;

    if (!this.areForMessage(message))
      throw new Error('Leftovers are not for this message');

    const { results } = leftovers;

    const leftover = results.shift()
      ?? $throw('No leftovers left');

    leftovers.baseId = leftover.id;

    messages.splice(messages.indexOf(message), 1, leftover);

    return { deletedMessage: message, leftovers };

  };

  cycleLeftovers(
    message: GenieMessage<A, 'assistant'>
  ) {

    const {
      deletedMessage,
      leftovers,
      leftovers: { activeMessageOriginalIndex, results }
    } = this.replaceWithLeftover(message);

    results.push(deletedMessage);

    leftovers.activeMessageOriginalIndex = (activeMessageOriginalIndex % (results.length + 1)) + 1;

  }

};
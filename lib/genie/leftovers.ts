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

export function areLeftoversForMessage<A extends AssetName>(
  leftovers: Leftovers<AssetName>,
  { id }: GenieMessage<A, "assistant">
): leftovers is Leftovers<A> {
  return !!id && (leftovers.baseId === id);
};

export function leftoversMixin<A extends AssetName>(

  { globalState: { leftoversStore }, chat, messages }: BaseChatController<GenieChatType, A>

) {

  return {

    getLeftovers() {
      return leftoversStore[chat.id] ??= defaultLeftovers;
    },


    setLeftovers(
      value: Leftovers<A>
    ) {
      leftoversStore[chat.id] = value;
    },

    replaceWithLeftover(
      message: GenieMessage<A, 'assistant'>
    ) {

      const leftovers = this.getLeftovers();

      if (!areLeftoversForMessage(leftovers, message))
        throw new Error('Leftovers are not for this message');

      const { results } = leftovers;

      const leftover = results.shift()
        ?? $throw('No leftovers left');

      leftovers.baseId = leftover.id;

      messages.splice(messages.indexOf(message), 1, leftover);

      return { deletedMessage: message, leftovers };

    },

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

  }

};

export type LeftoverHandler<A extends AssetName> = ReturnType<typeof leftoversMixin<A>>;
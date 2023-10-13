import { $throw } from "vovas-utils";
import { AssetName, ChatController, ChatId, GenieChatType, GenieMessage, MessageId } from ".";

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
  [id in ChatId]? : Leftovers<AssetName>
};

export function areLeftoversForMessage<A extends AssetName>(
  leftovers: Leftovers<AssetName>,
  { id }: GenieMessage<A, "assistant">
): leftovers is Leftovers<A> {
  return !!id && (leftovers.baseId === id);
};

export function getLeftovers<A extends AssetName>(
  this: ChatController<GenieChatType, A>
) {
  const { globalState: { leftoversStore }, chat } = this;
  return leftoversStore[chat.id] ??= defaultLeftovers;
};


export function setLeftovers<A extends AssetName>(
  this: ChatController<GenieChatType, A>,
  value: Leftovers<AssetName>
) {
  const { globalState: { leftoversStore }, chat } = this;
  leftoversStore[chat.id] = value;
};

export function replaceWithLeftover<A extends AssetName>(
  this: ChatController<GenieChatType, A>, 
  message: GenieMessage<A, 'assistant'>
) {

  const leftovers = this.getLeftovers();

  if (!areLeftoversForMessage(leftovers, message))
    throw new Error('Leftovers are not for this message');

  const { results } = leftovers;

  const leftover = results.shift()
    ?? $throw('No leftovers left');

  leftovers.baseId = leftover.id;

  this.messages.splice(this.messages.indexOf(message), 1, leftover);

  return { deletedMessage: message, leftovers };

}

export function cycleLeftovers<A extends AssetName>(
  this: ChatController<GenieChatType, A>,
  message: GenieMessage<A, 'assistant'>
) {

  const { 
    deletedMessage, 
    leftovers, 
    leftovers: { activeMessageOriginalIndex, results } 
  } = this.replaceWithLeftover(message);

  results.push(deletedMessage);
  
  leftovers.activeMessageOriginalIndex = (activeMessageOriginalIndex % ( results.length + 1 )) + 1;

};
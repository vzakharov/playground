import { $throw } from "vovas-utils";
import { AppChatMessage, ChatType, areLeftoversForMessage, getLeftovers } from "~/lib/jobgenie";
import { globalState } from "../state";
import { ChatController } from "./controller";

export function cycleLeftovers<T extends ChatType>(
  this: ChatController<T>, 
  message: AppChatMessage<T, 'assistant'>
) {

  const leftovers = getLeftovers(globalState, this.type);

  if (!areLeftoversForMessage(leftovers, message))
    throw new Error('Leftovers are not for this message');

  const { results } = leftovers;

  // Put the first leftover instead of the message, the second leftover instead of the first leftover, etc.
  // Put the message instead of the last leftover
  const leftover = results.shift()
    ?? $throw('No leftovers left');

  results.push(message);
  leftovers.baseId = leftover.id;
  leftovers.selectedIndex += 1;
  if (leftovers.selectedIndex > results.length + 1)
    leftovers.selectedIndex = 1;
  // That’s a tad ugly, but I don’t want to spend too much time on this

  this.messages.splice(this.messages.indexOf(message), 1, leftover);

};

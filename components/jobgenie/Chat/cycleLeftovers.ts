import { $throw } from "vovas-utils";
import { AppChatMessage, ChatType, areLeftoversForMessage } from "~/lib/jobgenie";
import { globalState } from "../state";
import { ChatController } from "./controller";

export function cycleLeftovers<T extends ChatType>(this: ChatController<T>, message: AppChatMessage<T>) {

  if (!areLeftoversForMessage(globalState.leftovers, message))
    throw new Error('Leftovers are not for this message');

  // Put the first leftover instead of the message, the second leftover instead of the first leftover, etc.
  // Put the message instead of the last leftover
  const leftover = globalState.leftovers.results.shift()
    ?? $throw('No leftovers left');

  globalState.leftovers.results.push(message);
  globalState.leftovers.baseId = leftover.id;
  globalState.leftovers.selectedIndex += 1;
  if (globalState.leftovers.selectedIndex > globalState.leftovers.results.length + 1)
    globalState.leftovers.selectedIndex = 1;
  // That’s a tad ugly, but I don’t want to spend too much time on this

  this.messages.splice(this.messages.indexOf(message), 1, leftover);

};

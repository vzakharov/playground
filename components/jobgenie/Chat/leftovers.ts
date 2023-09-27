import { $throw } from "vovas-utils";
import { AppChatMessage, ChatType, areLeftoversForMessage, getLeftovers } from "~/lib/jobgenie";
import { globalState } from "../state";
import { ChatController } from "./controller";


export function deleteLeftover<T extends ChatType>(
  this: ChatController<T>, 
  message: AppChatMessage<T, 'assistant'>
) {

  const leftovers = getLeftovers(globalState, this.type);

  if (!areLeftoversForMessage(leftovers, message))
    throw new Error('Leftovers are not for this message');

  const { results } = leftovers;

  const leftover = results.shift()
    ?? $throw('No leftovers left');

  leftovers.baseId = leftover.id;

  this.messages.splice(this.messages.indexOf(message), 1, leftover);

  return { message, leftovers };

}

export function cycleLeftovers<T extends ChatType>(
  this: ChatController<T>, 
  message: AppChatMessage<T, 'assistant'>
) {

  const { 
    message: deletedMessage, 
    leftovers, 
    leftovers: { selectedIndex, results } 
  } = this.deleteLeftover(message);

  results.push(deletedMessage);
  
  leftovers.selectedIndex = (selectedIndex % ( results.length + 1 )) + 1;

};
import { AppChatMessage, ChatType, areLeftoversForMessage, hash } from "~/lib/jobgenie";
import { $throw, Class } from "vovas-utils";
import { BaseChatController } from "./controller";
import { leftovers, state } from "../refs";

export function LeftoverHandler<T extends ChatType>(Base: Class<BaseChatController<T>>) {

  return class R extends Base {

    loopLeftovers(message: AppChatMessage<T>) {

      if ( !areLeftoversForMessage(state.leftovers, message) )
        throw new Error('Leftovers are not for this message');

      // Put the first leftover instead of the message, the second leftover instead of the first leftover, etc.
      // Put the message instead of the last leftover
      const leftover = state.leftovers.results.shift()
        ?? $throw('No leftovers left');

      state.leftovers.results.push(message);
      state.leftovers.hash = hash(leftover);

      this.messages.splice(this.messages.indexOf(message), 1, leftover);

    }

  }

};

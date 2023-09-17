import { $throw, Class } from "vovas-utils";
import { AppChatMessage, ChatType, areLeftoversForMessage } from "~/lib/jobgenie";
import { state } from "../refs";
import { BaseChatController } from "./controller";

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
      state.leftovers.baseId = leftover.id;
      state.leftovers.selectedIndex += 1;
      if ( state.leftovers.selectedIndex > state.leftovers.results.length + 1 )
        state.leftovers.selectedIndex = 1;
      // That’s a tad ugly, but I don’t want to spend too much time on this

      this.messages.splice(this.messages.indexOf(message), 1, leftover);

    }

  }

};

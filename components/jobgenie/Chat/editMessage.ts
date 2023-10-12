import { ChatType, JobGenieMessage } from "lib/jobgenie";
import { ChatController } from "./controller";

export function editMessage<T extends ChatType>(this: ChatController<T>, message: JobGenieMessage<T, 'user'>) {

  const { state, state: { generating, userMessageComponent } } = this;
  state.userMessage = message.content;
  this.removeMessagesFrom(message);
  if (generating?.inProgress) {
    generating.cancel();
  }
  nextTick(() => {
    const { textarea } = userMessageComponent ?? {};
    if ( !textarea ) return;
    textarea.select();
  });

};
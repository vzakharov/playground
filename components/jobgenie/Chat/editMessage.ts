import { ChatType, AppChatMessage } from "lib/jobgenie";
import { ChatController } from "./controller";

export function editMessage<T extends ChatType>(this: ChatController<T>, message: AppChatMessage<T, 'user'>) {

  const { state, state: { generating, userMessageComponent } } = this;
  state.userMessage = message.content;
  this.removeMessagesFrom(message);
  if (generating?.inProgress) {
    generating.cancel();
  }
  nextTick(() => {
    const { textarea } = userMessageComponent ?? {};
    if (!(textarea instanceof HTMLTextAreaElement)) return;
    textarea.select();
  });

};
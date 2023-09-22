import { ChatType, AppChatMessage } from "lib/jobgenie";
import { ChatController } from "./controller";

export function editMessage<T extends ChatType>(this: ChatController<T>, message: AppChatMessage<T, 'user'>) {

  const { state, state: { generating } } = this;
  state.userMessage = message.content;
  this.removeMessagesFrom(message);
  if (generating?.inProgress) {
    generating.cancel();
  }
  nextTick(() => {
    // userMessageComponent.value?.textarea?.select();
    const textarea = window.document.getElementById('userMessage');
    if (!(textarea instanceof HTMLTextAreaElement)) return;
    textarea.select();
  });

};
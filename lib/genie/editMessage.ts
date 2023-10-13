import { AssetName, ChatController, GenieChatType, GenieMessage } from ".";

export function editMessage<A extends AssetName>(
  this: ChatController<GenieChatType, A>,
  message: GenieMessage<A, 'user'>) {

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
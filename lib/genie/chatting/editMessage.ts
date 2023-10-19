import { AssetName, BaseChatController, GenieChatType, GenieMessage } from "..";

export function editMessage<Ts extends GenieChatType, T extends Ts, A extends AssetName>(
  this: BaseChatController<Ts, T, A>,
  message: GenieMessage<A, 'user'>) {

  const { config: { state, state: { generating, userMessageComponent } } } = this;
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
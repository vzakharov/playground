import _ from 'lodash';
import { ToRefs } from 'vue';
import { Resolvable, toReactive } from '~/lib/utils';
import {
  AssetName, GenieChatType, GenieMessage, Responder, findBy} from '..';

export type ChatControllerState<A extends AssetName> = {
  generating: Resolvable<GenieMessage<A, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: {
    textarea?: HTMLTextAreaElement;
  } | undefined;
  msExpected: number | undefined;
};

export class ChatController<Ts extends GenieChatType, T extends Ts, A extends AssetName> 
  extends Responder<Ts, T, A> { };

export type ChatControllerConfig<Ts extends GenieChatType, T extends Ts, A extends AssetName> = 
  ConstructorParameters<typeof ChatController<Ts, T, A>>[0];

export type AnyChatController = ChatController<GenieChatType, GenieChatType, AssetName>;

export const activeChatControllers = reactive<AnyChatController[]>([]);
activeChatControllers[0].config.type

export function renewChatController<Ts extends GenieChatType, T extends Ts, A extends AssetName>(
  config: ChatControllerConfig<Ts, T, A>
) {
  const { type, chatId } = config;
  const oldController = findBy({ config: { type, chatId }}, activeChatControllers);
  if (oldController) {
    console.log("Deleting old chat controller:", oldController);
    _.pull(activeChatControllers, oldController);
  };
  const newController = new ChatController(config);
  console.log("Creating new chat controller:", newController);
  activeChatControllers.push(newController as AnyChatController);
  return newController;
}

export function removeChatController(chatController: AnyChatController) {
  _.pull(activeChatControllers, chatController);
}
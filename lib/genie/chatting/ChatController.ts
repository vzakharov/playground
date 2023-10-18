import { Resolvable } from '~/lib/utils';
import {
  GenieMessage, Responder, GenieSchema, Tool
} from '..';

export type ChatControllerState<S extends GenieSchema, T extends Tool<S>> = {
  generating: Resolvable<GenieMessage<S, T, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: {
    textarea?: HTMLTextAreaElement;
  } | undefined;
  msExpected: number | undefined;
};

export class ChatController<S extends GenieSchema, T extends Tool<S>>
  extends Responder<S, T> { };

export type ChatControllerConfig<S extends GenieSchema, T extends Tool<S>> =
  ConstructorParameters<typeof ChatController<S, T>>[0];
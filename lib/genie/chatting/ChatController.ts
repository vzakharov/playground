import { Resolvable } from '~/lib/utils';
import {
  GenieMessage, Responder, GenieSchema, ToolName
} from '..';

export type ChatControllerState<S extends GenieSchema, T extends ToolName<S>> = {
  generating: Resolvable<GenieMessage<S, T, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: {
    textarea?: HTMLTextAreaElement;
  } | undefined;
  msExpected: number | undefined;
};

export class ChatController<S extends GenieSchema, T extends ToolName<S>>
  extends Responder<S, T> { };

export type ChatControllerConfig<S extends GenieSchema, T extends ToolName<S>> =
  ConstructorParameters<typeof ChatController<S, T>>[0];
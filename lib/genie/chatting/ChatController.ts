import { Resolvable } from '~/lib/utils';
import {
  GenieMessage, Responder, GenieSchema, ToolName, Toolset, ToolFrom
} from '..';

export type ChatControllerState<S extends Toolset, T extends ToolFrom<S>> = {
  generating: Resolvable<GenieMessage<T, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: {
    textarea?: HTMLTextAreaElement;
  } | undefined;
  msExpected: number | undefined;
};

export class ChatController<S extends Toolset, T extends ToolFrom<S>>
  extends Responder<S, T> { };

export type ChatControllerConfig<S extends Toolset, T extends ToolFrom<S>> =
  ConstructorParameters<typeof ChatController<S, T>>[0];
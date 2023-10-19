import { Resolvable } from '~/lib/utils';
import { AnyTool, GenieMessage, GenieSchema, Responder, ToolFrom } from '..';

export type ChatControllerState<T extends AnyTool> = {
  generating: Resolvable<GenieMessage<T, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: {
    textarea?: HTMLTextAreaElement;
  } | undefined;
  msExpected: number | undefined;
};

export class ChatController<S extends GenieSchema, T extends ToolFrom<S>>
  extends Responder<S, T> { };

export type ChatControllerConfig<S extends GenieSchema, T extends ToolFrom<S>> =
  ConstructorParameters<typeof ChatController<S, T>>[0];
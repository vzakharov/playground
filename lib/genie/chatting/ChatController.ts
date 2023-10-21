import { Resolvable } from '~/lib/utils';
import { AnyTool, GenieMessage, GenieSchema, Responder, Tool, ToolFrom, Toolset } from '..';
import { S } from 'docs/assets/entry.e5bb04e0';

export type ChatControllerState<T extends AnyTool> = {
  generating: Resolvable<GenieMessage<T, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: {
    textarea?: HTMLTextAreaElement;
  } | undefined;
  msExpected: number | undefined;
};

export class ChatController<  
  T extends AnyTool,
>
  extends Responder<T> { };

export type ChatControllerConfig<Id extends string, T extends AnyTool<Id>> =
  ConstructorParameters<typeof ChatController<T>>[0];
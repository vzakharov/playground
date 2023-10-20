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
  ToolId extends string,
  T extends AnyTool<ToolId>,
>
  extends Responder<ToolId, T> { };

export type ChatControllerConfig<Id extends string, T extends AnyTool<Id>> =
  ConstructorParameters<typeof ChatController<Id, T>>[0];
import { Resolvable } from '~/lib/utils';
import { AnyTool, GenieMessage } from '..';
import { Responder } from './responder';

export type ChatState<T extends AnyTool> = {
  generating: Resolvable<GenieMessage<T, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: {
    textarea?: HTMLTextAreaElement;
  } | undefined;
  msExpected: number | undefined;
  error: Error | undefined;
};

export class Chat<T extends AnyTool> extends Responder<T> { };

export type ChatConfig<Id extends string, T extends AnyTool<Id>> =
  ConstructorParameters<typeof Chat<T>>[0];
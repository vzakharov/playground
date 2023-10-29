import { Resolvable } from '~/lib/utils';
import { AnyTool, GlobalData, GenieMessage, GlobalState, SetFor, Tool } from '..';
import { Responder } from './responder';

export type ChatState<T extends AnyTool> = {
  generating: Resolvable<GenieMessage<T, 'assistant'>> | undefined;
  userMessage: string;
  userMessageComponent: {
    textarea?: HTMLTextAreaElement;
  } | undefined;
  msExpected: number | undefined;
  error: Error | undefined;
  dataLastLoaded: number;
};

export class Chat<
  T extends AnyTool, GD extends GlobalData<SetFor<T>>, GS extends GlobalState
> extends Responder<T, GD, GS> { };

export type ChatConfig<
  Id extends string, T extends Tool<Id, any, any>, GD extends GlobalData<SetFor<T>>, GS extends GlobalState
> =
  ConstructorParameters<typeof Chat<T, GD, GS>>[0];
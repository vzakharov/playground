import { Resolvable } from '~/lib/utils';
import { AnyTool, GenieData, GenieMessage, GenieState, SetFor } from '..';
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
  T extends AnyTool, GD extends GenieData<SetFor<T>>, GS extends GenieState
> extends Responder<T, GD, GS> { };

export type ChatConfig<
  Id extends string, T extends AnyTool<Id>, GD extends GenieData<SetFor<T>>, GS extends GenieState
> =
  ConstructorParameters<typeof Chat<T, GD, GS>>[0];
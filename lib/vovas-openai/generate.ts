import { FunctionThatReturns, give, ifGeneric, is } from "vovas-utils";
import { AnyChatFunction, ChatCompletionOptions, ChatCompletionResultItem, ChatMessage, Model, Usage, UsageContainer, UsageCost, chatCompletion } from ".";

const { log } = console;

export type PostProcess<Fn extends AnyChatFunction, Result> = (output: ChatCompletionResultItem<Fn>) => Result;

export type PostProcessed<Fn extends AnyChatFunction, PP> =
  PP extends PostProcess<Fn, infer Result>
    ? Result extends unknown
      ? ChatCompletionResultItem<Fn>
      : Result
    : ChatCompletionResultItem<Fn>;


export type GenerateConfig<
  Result,
  PP extends PostProcess<Fn, Result | null>,
  Evaluation,
  ThrowIfNone extends boolean,
  Fn extends AnyChatFunction
> = ChatCompletionOptions<Fn> & {
  maxAttempts?: number;
  throwIfNone?: ThrowIfNone;
  postProcess?: PP;
  evaluate: (result: PostProcessed<Fn, PP>) => Evaluation | null;
  betterIf: (current: Evaluation, best: Evaluation) => boolean;
  qualifiesIf?: (best: Evaluation) => boolean;
};

export type DebugData<E> = {
  evaluation: E | null;
  allEvaluations: ( E | null )[];
  attempts: number;
  usage: Usage;
  cost: UsageCost;
};

export type GenerateResult<
  Fn extends AnyChatFunction,
  PP,
  Evaluation,
  ThrowIfNone
> = {
  result: 
    ThrowIfNone extends true 
      ? PostProcessed<Fn, PP> 
      : PostProcessed<Fn, PP> | undefined;
  debugData: DebugData<Evaluation>;
};

export async function generate<
  Result,
  PP extends PostProcess<Fn, Result>,
  Evaluation,
  ThrowIfNone extends boolean,
  Fn extends AnyChatFunction
>(
  promptMessages: ChatMessage[], {
    maxAttempts = 3,
    throwIfNone,
    postProcess,
    // I.e., we need to warn (via returning never) if the user wants to generate a non-string result without using any post-processing.
    evaluate, 
    betterIf, 
    qualifiesIf = () => true,
    usageContainer = new UsageContainer(),
    ...chatCompletionOptions
  }: GenerateConfig<
    Result,
    PP,
    Evaluation,
    ThrowIfNone,
    Fn
  >) {

  let best: undefined | {
    result: PostProcessed<Fn, PP>;
    evaluation: Evaluation;
  };

  const allEvaluations: (Evaluation | null)[] = [];

  let attempts = 1;

  outer:
  for ( ; attempts <= maxAttempts ?? 3; attempts++ ) {

    const results = await chatCompletion(
      promptMessages,
      {
        ...chatCompletionOptions,
        usageContainer
      }
    );

    for ( const rawResult of results ) {

      log({ rawResult });

      const result = (
        postProcess === undefined
          ? rawResult
          : postProcess(rawResult)
      ) as PostProcessed<Fn, PP>;

      const evaluation = result ? evaluate(result) : null;
      allEvaluations.push(evaluation);

      if ( !result || !evaluation ) continue;

      if ( !best || betterIf(evaluation, best.evaluation) )
        best = { result, evaluation };

    };

    if ( best && qualifiesIf(best.evaluation) )
      break outer;

    log({ attempts, best });

  };

  const debugData: DebugData<Evaluation> = {
    evaluation: best?.evaluation ?? null,
    allEvaluations: allEvaluations as Evaluation[],
    attempts,
    ...usageContainer
  };

  const result = best?.result;

  if ( throwIfNone && !result )
    throw new GenerateException('noResult', debugData);

  return {
    result,
    debugData,
  } as GenerateResult<Fn, PP, Evaluation, ThrowIfNone>;

};

export class GenerateException extends Error {

  constructor(
    public readonly type: 'noResult',
    public readonly debugData: DebugData<any>,
  ) {

    super(type);
    
    this.message = {
      noResult: `Could not generate a qualifying result after ${debugData.attempts} attempts.`
    }[type];

  }

};

import { FunctionThatReturns, give, ifGeneric } from "vovas-utils";
import { ChatCompletionOptions, ChatMessage, Model, Usage, UsageContainer, UsageCost, chatCompletion } from ".";

const { log } = console;

export type GenerateConfig<
  Result,
  Evaluation,
  ThrowIfNone extends boolean
> = ChatCompletionOptions & {
  maxAttempts?: number;
  throwIfNone?: ThrowIfNone;
  postProcess?: (output: string) => Result | null;
  evaluate: (result: Result) => Evaluation | null;
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

export type GenerateResult<Result, Evaluation, ThrowIfNone> = {
  result: ThrowIfNone extends true ? Result : Result | undefined;
  debugData: DebugData<Evaluation>;
};

export async function generate<Result, Evaluation, ThrowIfNone extends boolean>(
  promptMessages: ChatMessage[], {
    maxAttempts = 3,
    throwIfNone,
    postProcess = give.itself as FunctionThatReturns<Result extends string ? Result : never>,
    // I.e., we need to warn (via returning never) if the user wants to generate a non-string result without using any post-processing.
    evaluate, 
    betterIf, 
    qualifiesIf = () => true,
    usageContainer = new UsageContainer(),
    ...chatCompletionOptions
  }: GenerateConfig<Result, Evaluation, ThrowIfNone>) {

  let best: undefined | {
    result: Result;
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

      const result = postProcess(rawResult);
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
  } as GenerateResult<Result, Evaluation, ThrowIfNone>;

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

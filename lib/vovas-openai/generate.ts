import { FunctionThatReturns, give, ifGeneric } from "vovas-utils";
import { ChatCompletionOptions, ChatMessage, Model, Usage, UsageContainer, UsageCost, chatCompletion } from ".";

const { log } = console;

export type GenerateConfig<
  Result,
  Evaluation
> = ChatCompletionOptions & {
  maxAttempts?: number;
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

export type GenerateResult<R, E> = {
  result?: R;
  debugData: DebugData<E>;
};

export async function generate<Result, Evaluation>(
  promptMessages: ChatMessage[], {
    postProcess = give.itself as FunctionThatReturns<Result extends string ? Result : never>,
    // I.e., we need to warn (via returning never) if the user wants to generate a non-string result without using any post-processing.
    evaluate, 
    betterIf, 
    qualifiesIf = () => true,
    usageContainer = new UsageContainer(),
    maxAttempts = 3,
    ...chatCompletionOptions
  }: GenerateConfig<Result, Evaluation>): Promise<GenerateResult<Result, Evaluation>> {

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

  return {
    result,
    debugData,
  };

}
;

import { ChatCompletionOptions, ChatMessage, Model, Usage, UsageContainer, UsageCost, chatCompletion } from ".";

const { log } = console;

export type GenerateConfig<
  Result,
  Evaluation
> = {
  count?: number;
  model?: Model;
  maxAttempts?: number;
  debug?: boolean;
  postProcess: (output: string) => Result | null;
  evaluate: (result: Result) => Evaluation | null;
  betterIf: (current: Evaluation, best: Evaluation) => boolean;
  qualifiesIf?: (best: Evaluation) => boolean;
}

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
    postProcess,
    evaluate, 
    betterIf, 
    qualifiesIf = () => true,
    ...config
  }: GenerateConfig<Result, Evaluation>): Promise<GenerateResult<Result, Evaluation>> {

  const { maxAttempts = 3, ...generateConfig } = config;

  let best: undefined | {
    result: Result;
    evaluation: Evaluation;
  };

  const allEvaluations: (Evaluation | null)[] = [];
  const usageContainer = new UsageContainer();

  let attempts = 1;

  outer:
  for ( ; attempts <= maxAttempts ?? 3; attempts++ ) {

    const results = await chatCompletion(
      promptMessages,
      {
        ...generateConfig,
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

export const shortestFirst = {

  evaluate: ( result: string ) => result.length,
  betterIf: ( evaluation: number, bestEvaluation: number ) => evaluation < bestEvaluation,

};
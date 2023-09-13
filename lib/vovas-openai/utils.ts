import { is } from "vovas-utils";

export const shortestFirst = {
  evaluate: ( result: string ) => result.length,
  betterIf: ( evaluation: number, bestEvaluation: number ) => evaluation < bestEvaluation,
};

export const itselfOrIts = <K extends string>( key: K ) => <T>( result: T | { [key in K]: T } ) =>
  is.object(result) ? result[key] : result;
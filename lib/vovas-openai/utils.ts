import { is } from "vovas-utils";

export const shortestFirst = {
  evaluate: ( result: string ) => result.length,
  betterIf: ( evaluation: number, bestEvaluation: number ) => evaluation < bestEvaluation,
};

export function itselfOrIts<K extends string>(key: K) {
  return <T>(result: T | {
    [key in K]: T;
  }) => is.object(result) ? result[key] : result;
}

export function keysOf<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}
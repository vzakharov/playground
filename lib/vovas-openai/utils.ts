import { is } from "vovas-utils";
import { ChatMessage, ChatRole, isBy } from "./chatMessage";
import { AnyChatFunction } from "./functions";
import _ from "lodash";

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

export function jsonChars(messages: ChatMessage[], fn?: AnyChatFunction) {
  return JSON.stringify([messages, fn]).length;
}

export function stackUp(strings: ( string | string[] | false | undefined )[]) {
  return _.compact(strings).flat().join('\n\n');
}
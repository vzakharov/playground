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

export function countJsonChars(messages: ChatMessage[], fn?: AnyChatFunction) {
  return JSON.stringify([messages, fn]).length;
}

export type NestedArrayable<T> = T | (T | NestedArrayable<T>)[];

export type StackUpable = NestedArrayable<string | false>;

export function stackUp(strings?: StackUpable) {
  return strings
    ? _.compact(_.castArray(strings).flat()).join('\n\n')
    : '';
}

export function codeBlock(string: string): `\`\`\`\n${string}\n\`\`\`` {
  return `\`\`\`\n${string}\n\`\`\``;
}

export type Inferrable<T, Args extends any[] = []> = T | ((...args: Args) => T);
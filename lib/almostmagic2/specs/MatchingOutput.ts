import { Specs, MatchesSpecValue, MatchesSpecKey, InferTypeFromSpecEntry } from ".";

export type MatchingOutput<O extends Specs> = 
  O extends string 
    ? MatchesSpecValue<O> extends never
      ? string
      : MatchesSpecValue<O>
  : O extends string[] 
    ? {
      [K in O[number]]: MatchesSpecKey<K> extends never
        ? string
        : MatchesSpecKey<K>;
    }
  : O extends Record<string, string> 
    ? {
      [K in keyof O]: InferTypeFromSpecEntry<O, K>;
    } : never;
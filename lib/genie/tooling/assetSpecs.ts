import { StringKey, sentenceCase } from "~/lib/utils";
import { Dict } from "..";
import _ from "lodash";
import { is } from "vovas-utils";


export type AssetSpecs<A extends string> = Record<A, string | [caption: string, description: string]>;

export type AssetFullSpecs<A extends string> = Record<A, {
  caption: string;
  description: string;
}>;

export type InferFullSpecs<S extends AssetSpecs<any>> = {
  [K in keyof S]: S[K] extends string ? {
    caption: string;
    description: string;
  } : {
    caption: S[K][0];
    description: S[K][1];
  };
};

export function toFullSpecs<S extends AssetSpecs<any>>(shortSpecs: S): InferFullSpecs<S> {
  return _.mapValues(shortSpecs, (spec, id) => is.string(spec)
    ? { caption: sentenceCase(id), description: spec }
    : { caption: spec[0], description: spec[1] }
  );
}
;

export function assetDescriptions<A extends string>(assetShortSpecs: AssetSpecs<A>) {
  return _.mapValues(toFullSpecs(assetShortSpecs), 'description') as Record<A, string>;
};

export function assetCaptions<A extends string>(assetShortSpecs: AssetSpecs<A>) {
  return _.mapValues(toFullSpecs(assetShortSpecs), 'caption') as Record<A, string>;
};

export function replaceKeysWithCaptions<
  V extends Record<string, any>,
  S extends AssetSpecs<StringKey<V>>
>(assetShortSpecs: S, values: V) {
  const fullSpecs = toFullSpecs(assetShortSpecs);
  return _.mapKeys(values, (value, key) => fullSpecs[key].caption) as {
    [K in InferFullSpecs<S>[keyof S]['caption']]: V[K];
  };
};

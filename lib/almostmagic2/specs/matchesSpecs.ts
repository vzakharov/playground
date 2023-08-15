import { Jsonable, is } from "vovas-utils";
import { MatchingOutput, Specs } from ".";
import { typeOf } from "./typeOf";
import { typeBasedOnSpecValue, typeBasedOnSpecKey, typeBasedOnSpecEntry } from "./utils";

export const matchesSpecs = <S extends Specs>(output: any, specs: S): output is MatchingOutput<S> =>
  is.jsonable(output) && (
    typeof specs === 'string'
      ? typeOf(output) === typeBasedOnSpecValue(specs) ?? 'string'
    : Array.isArray(specs)
      ? is.jsonableObject(output) && specs.every(key =>
        typeOf(output[key]) === typeBasedOnSpecKey(key) ?? 'string'
      )
    : is.jsonableObject(specs)
      ? is.jsonableObject(output) && Object.keys(specs).every(key =>
        typeOf(output[key]) === typeBasedOnSpecEntry(specs, key) ?? 'string'
      )
    : false
  );
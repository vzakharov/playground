import { is } from "vovas-utils";
import { MatchingOutput, Specs, typeBasedOnSpecEntry, typeBasedOnSpecKey, typeBasedOnSpecValue, typeOf } from ".";

export const outputMatchesSpecs = <S extends Specs>(output: any, specs: S): output is MatchingOutput<S> => {
  if (!is.jsonable(output)) return false;
  if (typeof specs === 'string') {
    return typeOf(output) === ( typeBasedOnSpecValue(specs) ?? 'string' );
  };
  if (Array.isArray(specs)) {
    return is.jsonableObject(output) && specs.every(key =>
      typeOf(output[key]) === ( typeBasedOnSpecKey(key) ?? 'string' )
    );
  };
  if (is.jsonableObject(specs)) {
    return is.jsonableObject(output) && Object.keys(specs).every(key =>
      typeOf(output[key]) === ( typeBasedOnSpecEntry(specs, key) ?? 'string' )
    );
  };
  return false;
}
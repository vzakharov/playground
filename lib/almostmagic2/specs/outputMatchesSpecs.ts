import _ from "lodash";
import { is } from "vovas-utils";
import { MatchingOutput, Specs, matchingOutputTypeKeys, typeOf } from ".";

export const outputMatchesSpecs = <S extends Specs>(output: any, specs: S): output is MatchingOutput<S> => 
  !is.jsonableObject(output)
    ? false
  : typeof specs === 'string'
    ? matchingOutputTypeKeys(specs) === typeOf(output)
  : _.isEqual(matchingOutputTypeKeys(specs), _.mapValues(output, typeOf));
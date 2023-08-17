import { is } from "vovas-utils";
import { MatchingOutput, Specs, matchingOutputTypeKeys, specTypeKeysIsObject, typeOf } from ".";
import { GenerateException, SpecMismatchException } from "../GenerateException";

// export const outputMatchesSpecs = <S extends Specs>(output: any, specs: S): output is MatchingOutput<S> => 
//   !is.jsonableObject(output)
//     ? false
//   : typeof specs === 'string'
//     ? matchingOutputTypeKeys(specs) === typeOf(output)
//   : _.isEqual(matchingOutputTypeKeys(specs), _.mapValues(output, typeOf));

export function assertOutputMatchesSpecs<S extends Specs>(output: any, specs: S): asserts output is MatchingOutput<S> {

  if ( !is.jsonable(output) )
    throw new GenerateException('outputNotJsonable', { output });
  
  const expectedTypes = matchingOutputTypeKeys(specs);

  if ( specTypeKeysIsObject(expectedTypes) ) {

    if ( !is.jsonableObject(output) )
      throw new GenerateException('outputNotJsonableObject', { output });

    for ( const key in expectedTypes ) {
      const expectedType = expectedTypes[key];
      const actualValue = output[key];
      if ( expectedType !== typeOf(actualValue) )
        throw new SpecMismatchException(specs, key, expectedType, actualValue)
    };

  } else {

    if ( expectedTypes !== typeOf(output) )
      throw new SpecMismatchException(specs, undefined, expectedTypes,  output)

  };

};

export const outputMatchesSpecs = <S extends Specs>(output: any, specs: S): output is MatchingOutput<S> => {
  try {
    assertOutputMatchesSpecs(output, specs);
    return true;
  } catch (e) {
    return false;
  };
}
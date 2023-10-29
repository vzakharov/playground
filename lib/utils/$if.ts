import _ from "lodash";

export function $if<Arg, Guarded extends Arg, Result, ElseResult>(
  arg: Arg,
  typeguard: (arg: Arg) => arg is Guarded,
  transform: (guarded: Guarded) => Result,
  elseTransform: (arg: Exclude<Arg, Guarded>) => ElseResult
): Result | ElseResult;

export function $if<Arg, Guarded extends Arg, Result>(
  arg: Arg,
  typeguard: (arg: Arg) => arg is Guarded,
  transform: (guarded: Guarded) => Result,
): Result | undefined;

export function $if<Arg, Guarded extends Arg, Result, ElseResult>(
  typeguard: (arg: Arg) => arg is Guarded,
  transform: (guarded: Guarded) => Result,
  elseTransform: (arg: Exclude<Arg, Guarded>) => ElseResult
): (arg: Arg) => Result | ElseResult;

export function $if<Arg, Guarded extends Arg, Result>(
  typeguard: (arg: Arg) => arg is Guarded,
  transform: (guarded: Guarded) => Result,
): (arg: Arg) => Result | undefined;

export function $if(
  argOrTypeguard: any,
  typeguardOrTransform: any,
  transformOrElseTransform?: any,
  elseTransform?: any,
) {

  if (_.isFunction(argOrTypeguard)) {
    return (arg: any) => $if(arg, argOrTypeguard as any, typeguardOrTransform as any, transformOrElseTransform as any);
  };

  const typeguard = typeguardOrTransform as (arg: any) => arg is any;
  const transform = transformOrElseTransform as (arg: any) => any;

  if (typeguard(argOrTypeguard)) {
    return transform(argOrTypeguard);
  } else {
    return elseTransform?.(argOrTypeguard);
  };

};
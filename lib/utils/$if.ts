export type $IfResult<Arg, Guarded extends Arg, Result> = {
  if: <SubGuarded extends Exclude<Arg, Guarded>>(
    typeguard: (arg: Exclude<Arg, Guarded>) => arg is SubGuarded,
    transform: (guarded: SubGuarded) => Result
  ) => $IfResult<Exclude<Arg, Guarded>, SubGuarded, Result>,
  else: (transform: (arg: Exclude<Arg, Guarded>) => Result) => Result,
};

function dummyIfResult<Result>(result: Result) {
  return {
    if: () => dummyIfResult(result),
    else: () => result,
  }
};

export function $if<Arg, Guarded extends Arg, Result>(
  arg: Arg,
  typeguard: (arg: Arg) => arg is Guarded,
  transform: (guarded: Guarded) => Result
): $IfResult<Arg, Guarded, Result> {
  if ( typeguard(arg) ) {
    return dummyIfResult(transform(arg))
  } else {
    return {
      if: (
        subTypeguard: (arg: any) => arg is any,
        subTransform: (arg: any) => any
      ) => $if(arg, subTypeguard, subTransform),
      else: (
        elseTransform: (arg: any) => any
      ) => elseTransform(arg),
    }
  }
};
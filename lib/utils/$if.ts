
export type Switch<Arg, Guarded extends Arg, Result, CombinedResult, ElseReturnsCallback extends boolean = false> = {
  if: <SubGuarded extends Exclude<Arg, Guarded>>(
    typeguard: (arg: Exclude<Arg, Guarded>) => arg is SubGuarded,
    transform: (guarded: SubGuarded) => Result
  ) => Switch<Exclude<Arg, Guarded>, SubGuarded, Result, CombinedResult & Result, ElseReturnsCallback>,
  // else: <R>(transform: (arg: Exclude<Arg, Guarded>) => R) => CombinedResult & R,
  else: <R>(transform: (arg: Exclude<Arg, Guarded>) => R) =>
    ElseReturnsCallback extends true
      ? (arg: Arg) => CombinedResult & R
      : CombinedResult & R,
};

function dummySwitch<Result>(result: Result) {
  return {
    if: () => dummySwitch(result),
    else: () => result,
  }
};

export function check<Arg>(arg: Arg): {
  if: <Guarded extends Arg, Result>(
    typeguard: (arg: Arg) => arg is Guarded,
    transform: (guarded: Guarded) => Result
  ) => Switch<Arg, Guarded, Result, Result>,
} {

  return {
    if(
      typeguard: (arg: any) => arg is any,
      transform: (arg: any) => any
    ) {
      if ( typeguard(arg) ) {
        return dummySwitch(transform(arg))
      } else {
        return {
          if: (
            subTypeguard: (arg: any) => arg is any,
            subTransform: (arg: any) => any
          ) => check<any>(arg).if(subTypeguard, subTransform),
          else: (
            elseTransform: (arg: any) => any
          ) => elseTransform(arg),
        }
      }
    }
  };
};

export function $if<Arg, Guarded extends Arg, Result>(
  arg: Arg,
  typeguard: (arg: Arg) => arg is Guarded,
  transform: (guarded: Guarded) => Result
): Switch<Arg, Guarded, Result, Result> {

  return check(arg).if(typeguard, transform);

};

export function checker<Arg>() {
  
  function _checker(
    typeguard: (arg: any) => arg is any,
    transform: (arg: any) => any,
    typeguardsAndTransforms = [] as { typeguard: (arg: any) => arg is any, transform: (arg: any) => any }[]
  ) {

    typeguardsAndTransforms.push({ typeguard, transform });

    return {
      if: (
        subTypeguard: (arg: any) => arg is any,
        subTransform: (arg: any) => any
      ) => _checker(subTypeguard, subTransform, typeguardsAndTransforms),
      
      else: (
        elseTransform: (arg: any) => any
      ) => {
        
        return (arg: any) => {

          for (const { typeguard, transform } of typeguardsAndTransforms) {
            if ( typeguard(arg) ) {
              return transform(arg);
            }
          }

          return elseTransform(arg);

        }

      }

    }

  }

  return {

    if: _checker as unknown as <Guarded extends Arg, Result>(
      typeguard: (arg: Arg) => arg is Guarded,
      transform: (guarded: Guarded) => Result,
    ) => Switch<Arg, Guarded, Result, Result, true>,

  }

};


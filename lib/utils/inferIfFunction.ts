import { isFunction } from ".";

export function inferIfFunction<Arg, Res>(target: Res | ((arg: Arg) => Res), arg: Arg): Res {
  return isFunction(target) ? target(arg) : target;
};
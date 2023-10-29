// export function ensured<T, G extends T>(typeguard: (arg: T) => arg is G) {
//   return {
//     else: (fallback: G) => (arg: T) => typeguard(arg) ? arg : fallback
//   };
// };

import _ from "lodash";

export function ensured<T, G extends T>(typeguard: (arg: T) => arg is G): {
  else: (fallback: G) => (arg: T) => G;
};

export function ensured<T, G extends T>(value: T, typeguard: (value: T) => value is G): {
  else: (fallback: G) => G;
};

export function ensured<T, G extends T>(_value: T | ((value: T) => value is G), _typeguard?: (value: T) => value is G) {
  const [ value, typeguard, returnCallback ] =
    _.isFunction(_value) 
      ? [ undefined, _value, true ]
      : [ _value, _typeguard!, false ];

  return {

    else: (fallback: G) =>
      returnCallback
        ? (arg: T) => typeguard(arg) ? arg : fallback
        : typeguard(value!) ? value : fallback

  };

};
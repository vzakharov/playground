import _ from 'lodash';

export function objectWithKeys<
  Key extends string,
  ReturnType
>(
  keys: Key[] | readonly Key[],
  initializer: <T extends Key>(key: T) => ReturnType
) {
  return _.fromPairs(
    keys.map(
      (key) => [key, initializer(key)]
    )
  ) as {
    [key in Key]: ReturnType;
  };
};

export function objectWithKeysOf<
  Ts extends Record<string, any>[],
  K extends keyof Ts[number],
  ReturnType
>(
  objects: Ts,
  keyBy: K,
  initializer: (object: Ts[number], id: Ts[number][K]) => ReturnType
) {
  return _.fromPairs(
    objects.map(
      (object: Ts[number]) => [object[keyBy], initializer(object, object[keyBy])]
    )
  ) as {
    [key in Ts[number][K]]: ReturnType;
  };
};
export function filter<T, G extends T>(
  typeguard: (value: T) => value is G,
) {
  return function (array: T[]): G[] {
    return array.filter(typeguard);
  };
}
export type AlphanumericChar = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '_';

export type AlphanumericPrefix<S extends string> = 
  S extends `${infer Start extends AlphanumericChar}${infer Rest}` 
    ? `${Start}${AlphanumericPrefix<Rest>}` 
    : '';

type TestAlphanumericString = AlphanumericPrefix<'helloWorld'>; // "helloWorld"
type TestAlphanumericString2 = AlphanumericPrefix<'hello_world'>; // "hello_world"
type TestAlphanumericString3 = AlphanumericPrefix<'hello-world'>; // "hello"
// I.e. it infers the longest possible alphanumeric string starting from the beginning of the string
// Thus, if `T extends AlphanumericPrefix<T>`, then the prefix is the entire string, so the string is alphanumeric

export type IsAlphanumeric<S extends string> = S extends AlphanumericPrefix<S> ? true : false;

export type GetPlaceholders<T extends string> = T extends `${string}{${infer P}}${infer Rest}`
  ? IsAlphanumeric<P> extends true
    ? P | GetPlaceholders<Rest> 
    : GetPlaceholders<Rest>
  : never;

const testString = 'I have a {color} car, a {color} yacht, and a {size} house, {or so I tell my friends}.';
type TestString = typeof testString;

type TestPlaceholders = GetPlaceholders<TestString>;
// => `"color" | "size"`; `"or so I tell my friends"` is not a placeholder because it's not alphanumeric

export type PlaceholderValues<T extends string> = {
  [K in GetPlaceholders<T>]: string;
};

type TestInferredPlaceholderValues = PlaceholderValues<TestString>;
// => { color: string, size: string }

const testLiteralPlaceholderValues = {
  color: 'luxury',
  size: 'big'
} as const satisfies TestInferredPlaceholderValues;

type TestLiteralPlaceholderValues = typeof testLiteralPlaceholderValues;
type TestNonLiteralPlaceholderValues = {
  color: 'luxury' | 'cheap'
  size: string
};

export type ReplacePlaceholders<T extends string, V extends PlaceholderValues<T>> =
  T extends `${infer Start}{${infer P}}${infer Rest}`
    ? P extends ( keyof V & AlphanumericPrefix<P> )
      ? `${Start}${V[P]}${ReplacePlaceholders<Rest, V>}`
      : T
    : T;

type TestReplacedLiteralString = ReplacePlaceholders<TestString, TestLiteralPlaceholderValues>;
// => "I have a luxury car, a luxury yacht, and a big house, {or so I tell my friends}."
type TestReplacedNonLiteralString = ReplacePlaceholders<TestString, TestNonLiteralPlaceholderValues>;
// `I have a luxury car, a luxury yacht, and a ${string} house, {or so I tell my friends}.` | `I have a luxury car, a cheap yacht, and a ${string} house, {or so I tell my friends}.` | `I have a cheap car, a luxury yacht, and a ${string} house, {or so I tell my friends}.` | `I have a cheap car, a cheap yacht, and a ${string} house, {or so I tell my friends}.`

// Note that here the inference is incorrect because it takes all possible combinations of `luxury` and `cheap` for the two `color` placeholders, even though we know that the two `color` placeholders must be the same. 
// This cannot be fixed by pure TypeScript, but the inferred type is a supertype of the actual type, so it's still safe to use the inferred type (i.e., it's still better and more descriptive than just `string`)
// A way around would be to only replace the first placeholder (and then exclude the key from PlaceholderValues when infering the next placeholder), but this would prevent some real use cases, so let's live with a slightly broader inferred type for now

export function replacePlaceholders<
  T extends string, 
  V extends PlaceholderValues<T>
>(template: T, values: V) {
  return template.replace(/{(\w+)}/g, (v, placeholder) => values[placeholder as keyof V]) as ReplacePlaceholders<T, V>;
};

const testReplacedLiteralString = replacePlaceholders(testString, testLiteralPlaceholderValues);
// => "I have a luxury car, a luxury yacht, and a big house, {or so I tell my friends}."

const getTestReplacedNonLiteralString = ( nonLiteralPlaceholderValues: TestNonLiteralPlaceholderValues ) => {
  const testReplacedNonLiteralString = replacePlaceholders(testString, nonLiteralPlaceholderValues);
  // => `I have a luxury car, a luxury yacht, and a ${string} house, {or so I tell my friends}.` | `I have a luxury car, a cheap yacht, and a ${string} house, {or so I tell my friends}.` | `I have a cheap car, a luxury yacht, and a ${string} house, {or so I tell my friends}.` | `I have a cheap car, a cheap yacht, and a ${string} house, {or so I tell my friends}.`
  return testReplacedNonLiteralString;
}
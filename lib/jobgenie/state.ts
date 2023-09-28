import _ from "lodash";
import { Jsonable, JsonableObject, genericTypeguard, is, itselfIf } from "vovas-utils";
import { ChatType } from "./ChatType";
import { Leftovers } from "./leftovers";

export const temperatureDescriptors = ['boring', 'normal', 'spicy', 'crazy'] as const;

export type TemperatureDescriptor = typeof temperatureDescriptors[number];

export const defaultGlobalState = {
  openaiKey: '',
  usdSpent: 0,
  useGpt4: true,
  savedMsPerPromptJsonChar: {
    'gpt-3.5-turbo': 5,
    'gpt-4': 15,
  },
  leftoversByChatType: {} as {
    [T in ChatType]?: Leftovers<T>
  },
  temperatureDescriptor: itselfIf(is.among(temperatureDescriptors)).else('normal'),
} satisfies Defaults;

export function typeOf(value: any) {
  return Array.isArray(value)
    ? 'array'
    : value === null
      ? 'null'
      : typeof value;
};

export type TypeName = ReturnType<typeof typeOf>;

export function isSameTypeAs<S>(sample: S) {
  return genericTypeguard<S>(arg => typeOf(arg) === typeOf(sample));
};

export type Defaults = Record<string, Jsonable | ((value: Jsonable) => any)>;

export type InferDefaultTypes<D extends Defaults> = {
  [K in keyof D]: D[K] extends (value: any) => infer T ? T : D[K];
};

export function defaultable<D extends Defaults>(
  object: JsonableObject, 
  defaults: D
) {
  return _.mapValues(defaults, ( defaultValueOrInitializer, key ) => {
    const value = object[key];
    return typeof defaultValueOrInitializer === 'function'
      ? defaultValueOrInitializer(value)
      : is.undefined(value)
        ? defaultValueOrInitializer
        : isSameTypeAs(defaultValueOrInitializer)(value)
          ? value
          : defaultValueOrInitializer;
  }) as InferDefaultTypes<D>;
};


export const temperatureForDescriptor: Record<TemperatureDescriptor, number> = {
  boring: 0,
  normal: 0.3,
  spicy: 0.7,
  crazy: 1,
};

export type GlobalState = typeof defaultGlobalState;
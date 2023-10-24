import { IsAny } from "~/lib/utils";
import _ from "lodash";

export type ChatFunction<Name extends string, Props extends string, Optional extends Props> = {
  name: Name,
  description: string,
  parameters: {
    type: 'object',
    properties: {
      [K in Props]: ChatFunctionProp
    },
    required: readonly Exclude<Props, Optional>[];
  }
};

export type AnyChatFunction = ChatFunction<any, any, never>;

export type SimplifiedChatFunction<Name extends string, Props extends string, Optional extends Props> = [
  ...SimplifiedChatFunctionWithAllProps<Name, Props, Optional>,
  optional: Optional[]
];

export type SimplifiedChatFunctionWithAllProps<Name extends string, Props extends string, Optional extends Props> = [
  name: Name,
  description: string,
  parameters: {
    [K in Props]: string
  },
];

export type SimplifiedChatFunctionFor<F extends AnyChatFunction> =
  F extends ChatFunction<infer Name, infer Props, infer Optional> 
    ? SimplifiedChatFunction<Name, Props, Optional> 
    : never;

export type UnsimplifiedChatFunctionFor<F extends SimplifiedChatFunction<any, any, any>> =
  F extends SimplifiedChatFunction<infer Name, infer Props, infer Optional> 
    ? ChatFunction<Name, Props, Optional> 
    : never;

export function chatFunction<Name extends string, Props extends string, Optional extends Props>(
  ...[ name, description, parameters, optional ]: SimplifiedChatFunction<Name, Props, Optional>
): ChatFunction<Name, Props, Optional>;

export function chatFunction<Name extends string, Props extends string>(
  ...[ name, description, parameters ]: SimplifiedChatFunctionWithAllProps<Name, Props, never>
): ChatFunction<Name, Props, never>;

export function chatFunction<Name extends string, Props extends string, Optional extends Props>(
  ...[ name, description, parameters, optional ]: SimplifiedChatFunction<Name, Props, Optional> | SimplifiedChatFunctionWithAllProps<Name, Props, Optional>
) {

  return {
    name,
    description,
    parameters: {
      type: 'object',
      properties: _.mapValues(parameters, description => ({ type: 'string', description })),
      required: optional ? _.difference(Object.keys(parameters), optional) : Object.keys(parameters)
    }
  } as unknown as ChatFunction<Name, Props, Optional>;

};

export type ChatFunctionProp = {
  type: 'string',
  description: string,
};

export type ChatFunctionReturns<F extends AnyChatFunction> =
  F extends ChatFunction<any, infer Props, infer Optional> ? {
    [K in Props]:
      IsAny<Props> extends true
        ? string | undefined 
        // i.e., if Props are not specified, we don't want to just index by string
      : [Optional] extends [never]
        ? string
      : K extends Optional
        ? string | undefined
      : string

  } : never;


const exampleChatFunction = chatFunction(
  'getForecast',
  'Gets the forecast for a given city and (optional) date',
  {
    city: 'The city to get the forecast for',
    date: 'The date to get the forecast for',
    language: 'The language to get the forecast in'
  },
  ['date', 'language']
)

type ExampleChatFunction = typeof exampleChatFunction;

type SimpleExampleChatFunction = SimplifiedChatFunctionFor<ExampleChatFunction>;
type UnsimplifiedExampleChatFunction = UnsimplifiedChatFunctionFor<SimpleExampleChatFunction>;

type ExampleChatFunctionReturns = ChatFunctionReturns<ExampleChatFunction>;

// Inferred type:
// type ExampleChatFunctionReturns = {
//   city: string;
//   date: string | undefined;
//   language: string | undefined;
// }

const callback = (r: ExampleChatFunctionReturns) => { }
// (parameter) r: {
//   city: string;
//   date: string | undefined;
//   language: string | undefined;
// }
import _ from "lodash";

export type Keyable = keyof any;

export type ChatFunction<Name extends string, Props extends Keyable, Optional extends Props | undefined> = {
  name: Name,
  description: string,
  parameters: {
    type: 'object',
    properties: {
      [K in Props]: ChatFunctionProp
    },
    required: Optional extends Props ? readonly Exclude<Props, Optional>[] : readonly Props[]
  }
};

export type AnyChatFunction = ChatFunction<string, Keyable, Keyable | undefined>;

export type SimplifiedChatFunction<Name extends string, Props extends Keyable, Optional extends Props> = [
  name: Name,
  description: string,
  parameters: {
    [K in Props]: string
  },
  optional?: readonly Optional[]
]

export function chatFunction<Name extends string, Props extends string, Optional extends Props>(
  ...[ name, description, parameters, optional = []]: SimplifiedChatFunction<Name, Props, Optional>
) {

  return {
    name,
    description,
    parameters: {
      type: 'object',
      properties: _.mapValues(parameters, description => ({ type: 'string', description })),
      required: _.difference(Object.keys(parameters), optional),
    }
  } as unknown as ChatFunction<Name, Props, Optional>;

};


export type ChatFunctionProp = {
  type: 'string',
  description: string,
};


export type ChatFunctionReturns<F extends AnyChatFunction> =
  F extends ChatFunction<any, infer Props, infer Optional> ? {
    [K in Props]: K extends Optional ? string | undefined : string
  } : never;


const exampleChatFunction = chatFunction(
  'getForecast',
  'Gets the forecast for a given city and (optional) date',
  {
    city: 'The city to get the forecast for',
    date: 'The date to get the forecast for',
  },
  ['date']
)

type ExampleChatFunction = typeof exampleChatFunction;

type ExampleChatFunctionReturns = ChatFunctionReturns<ExampleChatFunction>;

// Inferred type:
// type ExampleChatFunctionReturns = {
//   city: string;
//   date: string | undefined;
// }

const callback = (r: ExampleChatFunctionReturns) => { }
// (parameter) r: {
//   city: string;
//   date: string | undefined;
// }
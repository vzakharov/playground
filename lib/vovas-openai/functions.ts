import _ from "lodash";

export type ChatFunction<Name extends string, Props extends string, Required extends Props> = {
  name: Name,
  description: string,
  parameters: {
    type: 'object',
    properties: {
      [K in Props]: ChatFunctionProp
    },
    required: readonly Required[]
  }
};

export type AnyChatFunction = ChatFunction<any, any, any>;

export type SimplifiedChatFunction<Name extends string, Props extends string, Optional extends Props> = [
  name: Name,
  description: string,
  parameters: {
    [K in Props]: string
  },
  optional?: readonly Optional[]
]

export function chatFunction<Name extends string, Props extends string, Optional extends Props = never>(
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
  } as unknown as ChatFunction<Name, Props, Exclude<Props, Optional>>;

};


export type ChatFunctionProp = {
  type: 'string',
  description: string,
};


export type ChatFunctionReturns<F extends ChatFunction<any, any, any>> =
  F extends ChatFunction<any, infer Props, infer Required> ? {
    [K in Required]: string
  } & {
    [K in Exclude<Props, Required>]?: string
  } : never;


const exampleChatFunction = chatFunction(
  'getForecast',
  'Gets the forecast for a given city and (optional) date',
  {
    city: 'The city to get the forecast for',
    date: 'The date to get the forecast for',
  },
  // ['date']
)

type ExampleChatFunction = typeof exampleChatFunction;

type ExampleChatFunctionReturns = ChatFunctionReturns<ExampleChatFunction>;

// Inferred type:
// type ExampleChatFunctionReturns = {
//   city: string;
// } & {
//   date?: string | undefined;
// }

const exampleChatFunctionReturns: ExampleChatFunctionReturns = {
  city: 'San Francisco',  // Gives a compile error if commented out (required property)
  date: 'tomorrow',       // No compile error if commented out (optional property)
  // altitude: '1000ft',  // Gives a compile error if uncommented (invalid property)
};
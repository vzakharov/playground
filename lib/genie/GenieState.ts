import { is, itselfIf } from "vovas-utils";
import { Defaults, InferDefaultTypes } from "~/lib/utils";
import { AnyTool, ChatId, Leftovers, ToolIdFrom, ToolWithId, Toolset, temperatureDescriptors } from ".";

export type ToolLeftoversStore<T extends AnyTool> = {
  [CId in ChatId]?: Leftovers<T>;
};

export type LeftoversStore<S extends Toolset> = {
  [TId in ToolIdFrom<S>]?: ToolLeftoversStore<ToolWithId<S, TId>>;
};


export function defaultGenieState<S extends Toolset>(tools: S) {
  return ({
    openaiKey: '',
    usdSpent: 0,
    useGpt4: true,
    savedMsPerPromptJsonChar: {
      'gpt-3.5-turbo': 5,
      'gpt-4': 15,
    },
    temperatureDescriptor: itselfIf(is.among(temperatureDescriptors)).else('normal'),
    leftoversStore: {} as LeftoversStore<S>,
  } satisfies Defaults<any>);
}

// export type GenieState = InferDefaultTypes<typeof defaultGenieState>;
export type GenieState<S extends Toolset> = InferDefaultTypes<ReturnType<typeof defaultGenieState<S>>>;
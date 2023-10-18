import { is, itselfIf } from "vovas-utils";
import { Defaults, InferDefaultTypes } from "~/lib/utils";
import { Genie, LeftoversStore, GenieSchema, temperatureDescriptors } from ".";

export function defaultGenieState<S extends GenieSchema>(schema: S) {
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
export type GenieState<S extends GenieSchema> = InferDefaultTypes<ReturnType<typeof defaultGenieState<S>>>;
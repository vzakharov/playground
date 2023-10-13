import { is, itselfIf } from "vovas-utils";
import { TemperatureDescriptor, temperatureDescriptors } from "~/lib/genie";
import { Defaults, InferDefaultTypes } from "~/lib/utils";
import { ChatType } from "./ChatType";
import { Leftovers } from "./leftovers";

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

export type GlobalState = InferDefaultTypes<typeof defaultGlobalState>;
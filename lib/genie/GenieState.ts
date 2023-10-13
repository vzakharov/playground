import { give$, is, itselfIf } from "vovas-utils";
import { Defaults, InferDefaultTypes } from "~/lib/utils";
import { temperatureDescriptors, GenieChat, Leftovers, LeftoversStore, AssetName, GenieChatType, ChatId } from ".";

export const defaultGenieState = {
  openaiKey: '',
  usdSpent: 0,
  useGpt4: true,
  savedMsPerPromptJsonChar: {
    'gpt-3.5-turbo': 5,
    'gpt-4': 15,
  },
  leftoversStore: {} as LeftoversStore,
  temperatureDescriptor: itselfIf(is.among(temperatureDescriptors)).else('normal'),
} satisfies Defaults;

export type GenieState = InferDefaultTypes<typeof defaultGenieState>;
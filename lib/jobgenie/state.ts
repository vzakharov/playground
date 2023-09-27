import { Leftovers } from "./leftovers";
import { ChatType } from "./ChatType";

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
  temperatureDescriptor: 'spicy' as TemperatureDescriptor,
};

export const temperatureForDescriptor: Record<TemperatureDescriptor, number> = {
  boring: 0,
  normal: 0.3,
  spicy: 0.7,
  crazy: 1,
};

export type GlobalState = typeof defaultGlobalState;
import { InferDefaultTypes } from "lib/jobgenie";
import { TemperatureDescriptor, temperatureDescriptors } from ".";

export const defaultGenieState = {
  usdSpent: 0,
  useGpt4: false,
  temperatureDescriptor: () => temperatureDescriptors[0] as TemperatureDescriptor,
  apiKey: ''
};

export type GenieState = InferDefaultTypes<typeof defaultGenieState>;
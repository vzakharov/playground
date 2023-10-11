export const temperatureDescriptors = ['boring', 'normal', 'spicy', 'crazy'] as const;

export type TemperatureDescriptor = typeof temperatureDescriptors[number];
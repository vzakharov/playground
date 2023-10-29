export const temperatureDescriptors = ['boring', 'normal', 'spicy', 'crazy'] as const;

export type TemperatureDescriptor = typeof temperatureDescriptors[number];

export const temperatureForDescriptor: Record<TemperatureDescriptor, number> = {
  boring: 0,
  normal: 0.3,
  spicy: 0.7,
  crazy: 1,
};
import { StringKey } from "vovas-utils";
import { WritableComputedRef } from 'vue';

export function useModelWrapper<T, K extends StringKey<T>>(
  props: {
    [K in keyof T]: T[K];
  }, 
  emit: (event: `update:${K}`, value: T[K]) => void, 
  name: K
): WritableComputedRef<{ [K in keyof T]: T[K]; }[K]>;

export function useModelWrapper<T extends { modelValue: U }, U>(
  props: T, 
  emit: (event: 'update:modelValue', value: U) => void
): WritableComputedRef<U>;

export function useModelWrapper(
  props: any,
  emit: any,
  name = 'modelValue'
) {
  return computed({
    get: () => {
      return  props[name]
    },
    set: (value) => {
      emit(`update:${name}`, value)
    }
  });
};
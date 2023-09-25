import { StringKey } from "vovas-utils";
import { WritableComputedRef } from 'vue';

export function useModelWrapper<U, K extends string>(
  props: {
    [Key in K]: U
  }, 
  emit: (event: `update:${K}`, value: U) => void, 
  name: K
): WritableComputedRef<U>

export function useModelWrapper<U>(
  props: { modelValue: U }, 
  emit: (event: 'update:modelValue', value: U) => void
): WritableComputedRef<U>;

export function useModelWrapper(
  props: any,
  emit: any,
  name = 'modelValue'
) {
  return computed({
    get: () => {
      return props[name]
    },
    set: (value) => {
      emit(`update:${name}`, value)
    }
  });
};
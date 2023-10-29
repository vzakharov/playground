<template>
  <div class="toggle-container">
    <label for="toggle" class="flex items-center cursor-pointer">
      <LeftLabelDiv/>
      <div class="relative">
        <input type="checkbox" id="toggle" :checked="modelValue" @change="updateValue" class="hidden" />
        <div class="toggle__line bg-gray-400 rounded-full shadow-inner"/>
        <div class="toggle__dot absolute bg-white rounded-full shadow inset-y-0 left-0"/>
      </div>
      <RightLabelDiv/>
    </label>
  </div>
</template>

<script setup lang="ts" generic="TwoWay extends boolean = false">

import { $throw, is } from 'vovas-utils';
import { targetedEventHandler } from './utils';
import { PropType } from 'nuxt/dist/app/compat/capi';
import { objectWithKeys } from '~/lib/utils';

const props = defineProps<{
  modelValue: boolean,
  twoWay?: boolean & TwoWay,
  label?: ( TwoWay extends false ? string : never ) | { on: string, off: string };
  title?: string,
}>();

const emit = defineEmits<{
  'update:modelValue': [boolean];
}>();

const updateValue = targetedEventHandler(HTMLInputElement, event => {
  emit('update:modelValue', event.target.checked);
});

const [ LeftLabelDiv, RightLabelDiv ] = [ true, false ].map(isLeft => computed(() => {

  const { label, modelValue, twoWay, title} = props;

  const labelValue = twoWay
    ? is.string(label)
      ? $throw("Label must be provided as an { on: string, off: string } object if `twoWay` is true")
      : label?.[ isLeft ? 'off' : 'on' ]
    : isLeft
      ? undefined
      : is.string(label)
        ? label
        : label?.[ modelValue ? 'on' : 'off' ];

  return h('div', {
    class: {
      [`m${ isLeft ? 'r' : 'l' }-3`]: true,
      'text-gray-300': 
        twoWay 
          ? ( isLeft === modelValue )
          : !modelValue,
    },
    title,
  }, labelValue);

}));

</script>

<style scoped lang="postcss">
.toggle-container {
  @apply my-4;
}

.toggle__line {
  @apply transition-all duration-200 ease-in-out w-8 h-4;
}

.toggle__dot {
  @apply transition-all duration-200 ease-in-out transform w-4 h-4;
}

input:checked~.toggle__line {
  @apply bg-blue-500;
}

input:checked~.toggle__dot {
  @apply translate-x-full border-blue-400;
}
</style>
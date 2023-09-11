<template>
  <button
    :disabled="disabled"
    :class="{
      btn: true,
      'btn-disabled': disabled,
      'btn-primary': !disabled && !outline,
      'btn-outline': !disabled && outline,
      'btn-rounded': rounded,
      'px-2 py-1': small,
      'px-4 py-2': !small
    }"
    :type="type"
    @click="onClick"
  >
    <slot>{{ caption }}</slot>
  </button>
</template>

<script setup lang="ts">
import { PropType } from 'nuxt/dist/app/compat/capi';

const props = defineProps({
  disabled: Boolean,
  caption: String,
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  },
  rounded: Boolean,
  small: Boolean,
  outline: Boolean
})

const emit = defineEmits(['click'])

const onClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style scoped lang="postcss">
.btn {
  @apply text-white font-bold rounded;
}

.btn-primary {
  @apply bg-blue-500 hover:bg-blue-700;
}

.btn-disabled {
  @apply bg-gray-500 cursor-not-allowed;
}

.btn-outline {
  @apply border border-gray-500 text-gray-500 font-medium;
  @apply hover:bg-gray-500 hover:text-white;
  @apply focus:outline-none;
}

.btn-rounded {
  @apply rounded-full;
}
</style>
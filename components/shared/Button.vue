<template>
  <button
    :disabled="disabled"
    :class="{
      btn: true,
      'btn-disabled': disabled,
      'btn-primary': !disabled && !outline && primary,
      'btn-outline-primary': !disabled && outline && primary,
      'btn-secondary': !disabled && !outline && !primary,
      'btn-outline-secondary': !disabled && outline && !primary,
      'btn-rounded': rounded,
      'px-2 py-1': small,
      'px-4 py-2': !small
    }"
    :type="type ?? 'button'"
    :title="tooltip"
    @click="onClick"
  >
    <slot>{{ caption }}</slot>
  </button>
</template>

<script setup lang="ts">

  import { buttonProps } from './buttonStuff';

  const props = defineProps(buttonProps);

  const emit = defineEmits(['click'])

  const onClick = () => {
    if ( !props.disabled ) {
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

.btn-secondary {
  @apply bg-gray-500 hover:bg-gray-700;
}

.btn-disabled {
  @apply bg-gray-300 cursor-not-allowed;
}

.btn-outline-secondary {
  @apply border border-gray-400 text-gray-400 font-medium;
  @apply hover:bg-gray-500 hover:text-white;
  @apply focus:outline-none;
}

.btn-outline-primary {
  @apply border border-blue-400 text-blue-400 font-medium;
  @apply hover:bg-blue-500 hover:text-white;
  @apply focus:outline-none;
}

.btn-rounded {
  @apply rounded-full;
}
</style>
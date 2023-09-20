<template>
  <button
    :disabled="disabled"
    :class="`
      btn 
      ${disabled && 'btn-disabled'}
      ${!disabled && !outline && 'btn-primary'}
      ${!disabled && outline && 'btn-outline'}
      ${rounded && 'btn-rounded'}
      ${small ? 'px-2 py-1' : 'px-4 py-2'}
    `"
    :type="type"
    :title="tooltip"
    @click="onClick"
  >
    <slot>{{ caption }}</slot>
  </button>
</template>

<script setup lang="ts">

  type ButtonProps = {
    caption: string,
    disabled?: boolean,
    type?: 'button' | 'submit' | 'reset',
    rounded?: boolean,
    small?: boolean,
    outline?: boolean,
    checkmarkAfterCallback?: boolean,
    tooltip?: string,
  }
  
  const props = defineProps<ButtonProps>();

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

.btn-disabled {
  @apply bg-gray-500 cursor-not-allowed;
}

.btn-outline {
  @apply border border-gray-400 text-gray-400 font-medium;
  @apply hover:bg-gray-500 hover:text-white;
  @apply focus:outline-none;
}

.btn-rounded {
  @apply rounded-full;
}
</style>
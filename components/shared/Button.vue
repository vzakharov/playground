<template>
  <button
    :disabled="disabled"
    :class="{ 'primary-btn': !disabled, 'disabled-btn': disabled }" 
    type="button" 
    @click="onClick"
  >
    <slot>{{ caption }}</slot>
  </button>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'

  const props = defineProps({
    disabled: Boolean,
    caption: String
  })

  const emit = defineEmits(['click'])

  const onClick = () => {
    if (!props.disabled) {
      emit('click')
    }
  }
</script>

<style scoped lang="postcss">
  .primary-btn {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }

  .disabled-btn {
    @apply bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed;
  }
</style>
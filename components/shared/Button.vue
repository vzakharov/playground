<template>
  <button
    :disabled="disabled"
    :class="['btn', disabled ? 'btn-disabled' : 'btn-primary']"
    type="button" 
    @click="onClick"
  >
    <slot>{{ caption }}</slot>
  </button>
</template>

<script setup lang="ts">
  
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
  .btn {
    @apply text-white font-bold py-2 px-4 rounded;
  }

  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700;
  }

  .btn-disabled {
    @apply bg-gray-500 cursor-not-allowed;
  }
</style>
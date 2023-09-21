<template>
  <div class="toggle-container">
    <label for="toggle" class="flex items-center cursor-pointer">
      <div class="relative">
        <input type="checkbox" id="toggle" :checked="modelValue" @change="updateValue" class="hidden" />
        <div class="toggle__line bg-gray-400 rounded-full shadow-inner"></div>
        <div class="toggle__dot absolute bg-white rounded-full shadow inset-y-0 left-0"></div>
      </div>
      <div class="ml-3" :title="title" v-text="label" />
    </label>
  </div>
</template>

<script setup lang="ts">
import { targetedEventHandler } from './utils';

const props = defineProps({
  modelValue: Boolean,
  label: String,
  title: String,
});

const emit = defineEmits<{
  'update:modelValue': [boolean];
}>();

const updateValue = targetedEventHandler(HTMLInputElement, event => {
  emit('update:modelValue', event.target.checked);
});

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
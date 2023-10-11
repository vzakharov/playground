<script setup lang="ts" generic="T extends string">

  import { useModelWrapper } from '~/composables/useModelWrapper';

  const props = defineProps<{ 
    label: string, 
    options: readonly T[], 
    modelValue: T 
  }>()

  const emits = defineEmits<{
    'update:modelValue': [T]
  }>()

  const input = useModelWrapper(props, emits)

</script>

<template>
  <div class="container">
    <label class="label">{{ label }}</label>
    <select class="dropdown" v-model="input">
      <option v-for="option in options" :value="option" v-text="option" />
    </select>
  </div>
</template>

<style scoped lang="postcss">

.container {
  @apply flex flex-col;
}

.label {
  @apply text-gray-400 text-sm mb-2;
}

.dropdown {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
}

</style>
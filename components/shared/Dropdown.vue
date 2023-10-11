<script setup lang="ts" generic="T extends string">

  import { useModelWrapper } from '~/composables/useModelWrapper';

  const props = defineProps<{ 
    label: string, 
    options: readonly T[], 
    modelValue: T,
    cycleOnClick?: boolean,
  }>()

  const emits = defineEmits<{
    'update:modelValue': [T]
  }>()

  const input = useModelWrapper(props, emits)

  function cycle(backwards: boolean) {
    const index = props.options.indexOf(input.value)
    let nextIndex = index + (backwards ? -1 : 1)
    if (nextIndex < 0) nextIndex = props.options.length - 1
    if (nextIndex >= props.options.length) nextIndex = 0
    input.value = props.options[nextIndex]
  };

</script>

<template>
  <div class="container">
    <label class="label">{{ label }}</label>
    <select v-if="!cycleOnClick" class="dropdown" v-model="input">
      <option v-for="option in options" :value="option" v-text="option" />
    </select>
    <button v-else class="dropdown text-left cursor-auto"
      v-text="input" 
      @click="cycle($event.metaKey || $event.ctrlKey || $event.shiftKey)"
    />
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
  @apply appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
}

</style>
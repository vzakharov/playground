<script setup lang="ts">

import { uniqueId } from '~/lib/utils';

const props = defineProps<{
  label?: string;
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  lazy?: boolean;
  invalidIf?: (value: string) => boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const text = ref('');
watchEffect(() => text.value = props.modelValue);

const id = uniqueId('input');
const invalid = computed(() => props.invalidIf?.(text.value) ?? false);

watch(text, () =>
  !props.lazy && updateModelValue()
);

function updateModelValue() {
  if ( !invalid.value ) {
    emit('update:modelValue', text.value);
  }
};

</script>

<template>
  <div class="container">
    <label v-if="label" class="label" :for="id" v-text="label" />
    <input :class="{
      input: true,
      invalid,
    }" :="{
      id,
      placeholder,
      disabled,
      readonly,
    }"
      v-model="text"
      @blur="lazy && updateModelValue()"
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

.input {
  @apply bg-white border rounded-md py-2 px-4 block w-full appearance-none leading-normal;
}

.invalid {
  @apply border-red-500 focus:outline-none;
}
</style>
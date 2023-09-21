<script setup lang="ts">

import _ from 'lodash';
import { targetedEventHandler } from './utils';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: String,
  submitOnEnter: {
    type: Boolean,
    default: false
  },
  minHeight: {
    type: Number,
    default: 50
  },
  maxHeight: {
    type: Number,
    default: 200
  }
});

const emit = defineEmits<{
  'update:modelValue': [value: string],
  submit: [text: string],
}>();

const input = ref(props.modelValue);

const textarea = ref<HTMLTextAreaElement>();
const height = ref(props.minHeight);

const handleInput = targetedEventHandler(HTMLTextAreaElement, ({ target: { scrollHeight, value } }) => {
  height.value = scrollHeight;
  emit('update:modelValue', value);
})

const handleKeydown = (key: 'enter' | 'shift+enter') => {
  if (key === 'enter' === props.submitOnEnter) {
    emit('submit', input.value);
  } else {
    emit('update:modelValue', input.value + '\n');
  }
}

watch(textarea, (newVal) => {
  if (newVal) {
    height.value = newVal.scrollHeight;
  }
});

defineExpose({ htmlElement: textarea });

</script>

<template>
  <textarea class="textarea"
    ref="textarea"
    v-model="input"
    :style="_.mapValues({ minHeight, maxHeight, height }, v => `${v}px`)"
    :="{ placeholder }"
    @enter.prevent="handleKeydown('enter')"
    @shift.enter="handleKeydown('shift+enter')"
    @input="handleInput"
  />
</template>


<style scoped lang="postcss">
.textarea {
  @apply bg-white border border-gray-300 rounded-md py-2 px-4 block w-full appearance-none leading-normal;
  overflow: auto;
  resize: none;
}
</style>
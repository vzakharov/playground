<script setup lang="ts">
import { ref, onMounted, nextTick, watchEffect } from 'vue'

const props = defineProps<{
  title: string,
  description: string,
  buttonText: string,
  initialText?: string,
  monospace?: boolean,
  modelValue: boolean,
}>();

const text = ref(props.initialText ?? '');
const textareaRef = ref<HTMLTextAreaElement>();

const emit = defineEmits<{
  'update:modelValue': [isVisible: boolean],
  submit: [text: string],
  cancel: []
}>();

function submit() {
  const enteredText = text.value;
  if (enteredText) {
    emit('submit', enteredText);
    emit('update:modelValue', false);
  };
};

function cancel() {
  emit('cancel');
  emit('update:modelValue', false);
};

watchEffect(() => {
  if (props.modelValue) {
    nextTick(() => {
      textareaRef.value?.focus();
      textareaRef.value?.select();
    });
  }
});

</script>

<template>
  <div v-if="props.modelValue" class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">{{ title }}</h2>
      <p class="modal-description">{{ props.description }}</p>
      <textarea ref="textareaRef" v-model="text" class="modal-textarea" :class="{ 'monospace': props.monospace }"></textarea>
      <div class="modal-buttons">
        <button class="cancel-button" @click="cancel">Cancel</button>
        <button class="submit-button" @click="submit">{{ buttonText }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center;
}

.modal-content {
  @apply bg-white rounded-lg p-8 w-5/6 h-5/6 overflow-auto;
}

.modal-title {
  @apply text-lg font-sans font-bold mb-2;
}

.modal-description {
  @apply text-sm text-gray-500 mb-4;
}

.modal-textarea {
  @apply w-full h-3/4 border-gray-300 rounded-lg p-2 mb-4 resize-none;
}

.modal-textarea.monospace {
  @apply font-mono;
}

.modal-buttons {
  @apply flex justify-end;
}

.cancel-button {
  @apply bg-gray-300 text-gray-700 rounded-lg px-4 py-2 mr-2;
}

.submit-button {
  @apply bg-blue-500 text-white rounded-lg px-4 py-2;
}
</style>
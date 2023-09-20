<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string,
  buttonText: string,
  initialText?: string,
}>();

const text = ref(props.initialText ?? '');

const emit = defineEmits<{
  submit: [text: string],
  cancel: []
}>();

function submit() {
  // Emit an event with the text
  const enteredText = text.value;
  if (enteredText) {
    emit('submit', enteredText);
  };
};

function cancel() {
  emit('cancel');
};

</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">{{ title }}</h2>
      <textarea class="modal-textarea"></textarea>
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
  @apply bg-white rounded-lg p-8;
}

.modal-title {
  @apply text-lg font-medium mb-4;
}

.modal-textarea {
  @apply w-full border-gray-300 rounded-lg p-2 mb-4;
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
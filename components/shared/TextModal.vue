<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps<{
  title: string,
  buttonText: string,
  initialText?: string,
  monospace?: boolean,
}>();

const text = ref(props.initialText ?? '');
const textareaRef = ref<HTMLTextAreaElement>();

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

onMounted(async () => {
  await nextTick();
  textareaRef.value?.focus();
  textareaRef.value?.select();
});

</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">{{ title }}</h2>
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
  @apply text-lg font-medium mb-4;
}

.modal-textarea {
  @apply w-full h-5/6 border-gray-300 rounded-lg p-2 mb-4 resize-none;
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
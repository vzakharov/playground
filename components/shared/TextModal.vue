<script setup lang="ts">

import Button from './Button.vue'
import ButtonGroup from './ButtonGroup.vue'

const props = defineProps<{
  title: string,
  description: string,
  buttonText: string,
  monospace?: boolean,
  modelValue: { isVisible: boolean, text: string, updateData: boolean }
}>();

const text = ref<string>();
const textareaRef = ref<HTMLTextAreaElement>();

const emit = defineEmits<{
  'update:modelValue': [value: { isVisible: boolean, text: string, updateData: boolean }],
  submit: [text: string],
  cancel: []
}>();

function submit() {
  const enteredText = text.value;
  if (enteredText) {
    emit('update:modelValue', { isVisible: false, text: enteredText, updateData: true });
  };
};

function cancel() {
  emit('update:modelValue', { ...props.modelValue, isVisible: false, updateData: false });
};

function clickOutside(event: Event) {
  if (event.target === event.currentTarget) {
    cancel();
  }
}

watchEffect(() => {
  if (props.modelValue.isVisible) {
    text.value = props.modelValue.text;
    nextTick(() => {
      textareaRef.value?.focus();
      textareaRef.value?.select();
    });
  }
});

</script>

<template>
  <div v-if="props.modelValue.isVisible" class="modal-overlay" @click="clickOutside">
    <div class="modal-content">
      <h2 class="modal-title">{{ title }}</h2>
      <p class="modal-description">{{ props.description }}</p>
      <textarea ref="textareaRef" v-model="text" class="modal-textarea" :class="{ 'monospace': props.monospace }"></textarea>
      <div class="modal-buttons">
        <!-- <Button outline rounded caption="Cancel" @click="cancel" />
        <Button rounded :caption="buttonText" @click="submit" /> -->
        <ButtonGroup :buttons="[
          { caption: 'Cancel', onClick: cancel, outline: true, rounded: true },
          { caption: buttonText, onClick: submit, rounded: true }
        ]" />
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center;
}

.modal-content {
  @apply bg-white rounded-lg p-8 w-5/6 h-5/6 overflow-auto flex flex-col;
}

.modal-title {
  @apply text-lg font-sans font-bold mb-2;
}

.modal-description {
  @apply text-sm text-gray-500 mb-4;
}

.modal-textarea {
  @apply w-full border-gray-300 rounded-lg p-2 mb-4 resize-none flex-grow;
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
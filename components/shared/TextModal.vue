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
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white rounded-lg p-8">
      <h2 class="text-lg font-medium mb-4">{{ title }}</h2>
      <textarea class="w-full border-gray-300 rounded-lg p-2 mb-4" v-model="text"></textarea>
      <div class="flex justify-end">
        <button class="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 mr-2" @click="cancel">Cancel</button>
        <button class="bg-blue-500 text-white rounded-lg px-4 py-2" @click="submit">{{ buttonText }}</button>
      </div>
    </div>
  </div>
</template>

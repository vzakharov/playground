<script setup lang="ts">

import { useVisibility } from '~/composables/useVisibility';
import ButtonGroup from './ButtonGroup.vue';
import { ButtonPropsForGroup } from './buttonStuff';

const props = defineProps<{
  title: string,
  description: string,
  updateButtonText?: string,
  monospace?: boolean,
  modelValue: string,
  extraButtons?: ButtonPropsForGroup[]
}>();

const text = ref<string>();
const textareaRef = ref<HTMLTextAreaElement>();
const visibility = useVisibility();

const emit = defineEmits<{
  'update:modelValue': [value: string],
  submit: [text: string],
  cancel: []
}>();

function submit() {
  const enteredText = text.value;
  if (enteredText) {
    emit('update:modelValue', enteredText);
    visibility.hide();
  };
};

function cancel() {
  visibility.hide();
};

function clickOutside(event: Event) {
  if (event.target === event.currentTarget) {
    cancel();
  }
}

watchEffect(() => {
  if (visibility.on) {
    text.value = props.modelValue;
    nextTick(() => {
      textareaRef.value?.focus();
      textareaRef.value?.select();
    });
  }
});

defineExpose({ text, ...visibility });

</script>

<template>
  <div v-if="visibility.on" class="modal-overlay" @click="clickOutside">
    <div class="modal-content">
      <h2 class="modal-title">{{ title }}</h2>
      <p class="modal-description">{{ description }}</p>
      <textarea ref="textareaRef" v-model="text" :class="{ monospace }"></textarea>
      <div class="modal-footer">
        <div>
          <ButtonGroup 
            v-if="extraButtons" 
            :default-props="{ rounded: true}"
            :buttons="extraButtons" 
          />
        </div>
        <ButtonGroup
          :default-props="{ rounded: true }"
          :buttons="[
            { caption: 'Cancel', onClick: cancel },
            { 
              caption: updateButtonText ?? 'Update',
              disabled: !text || text === modelValue, 
              onClick: submit, 
              primary: true, 
              tooltip: !text ? 'Please enter some text.' : text === modelValue ? 'Please edit the text first.' : ''
            }
          ]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center;
}

.modal-content {
  @apply bg-white rounded-lg p-8 w-5/6 h-5/6 overflow-auto flex flex-col text-gray-800;
}

.modal-title {
  @apply text-lg font-sans font-bold mb-2;
}

.modal-description {
  @apply text-sm text-gray-500 mb-4;
}

textarea {
  @apply w-full border-gray-300 rounded-lg p-2 mb-4 resize-none flex-grow;
}

textarea.monospace {
  @apply font-mono bg-gray-800 text-gray-300;
}

.modal-footer {
  @apply flex justify-between;
}

.cancel-button {
  @apply bg-gray-300 text-gray-700 rounded-lg px-4 py-2 mr-2;
}

.submit-button {
  @apply bg-blue-500 text-white rounded-lg px-4 py-2;
}
</style>
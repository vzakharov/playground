<script setup>

import { ref, computed } from 'vue';
import Dropdown from '~/components/shared/Dropdown.vue';
import Textarea from '~/components/shared/Textarea.vue';
// import { requestOpenAI } from './openai-api'; // abstracted OpenAI API request

const tab = ref('compose');
const messages = ref([{ text: '', role: 'user' }]);
const output = ref('');

const addMessage = () => {
  messages.value.push({ text: '', role: 'user' });
};

const inputs = computed(() => {
  const placeholders = messages.value.flatMap(message => message.text.match(/{.*?}/g) || []);
  return placeholders.map(placeholder => ({ placeholder, value: '' }));
});

const run = async () => {
  const text = messages.value.map(message => message.text).join('\n');
  const filledText = inputs.value.reduce((text, input) => text.replace(input.placeholder, input.value), text);
  output.value = await requestOpenAI(filledText);
};

</script>

<template>
  <div class="app-container">
    <div class="tab-container">
      <button class="tab-button" :class="{ active: tab === 'compose' }" @click="tab = 'compose'">Compose</button>
      <button class="tab-button" :class="{ active: tab === 'run' }" @click="tab = 'run'">Run</button>
    </div>

    <div v-if="tab === 'compose'" class="compose-container">
      <div class="message-container" v-for="(message, index) in messages" :key="index">
        <Dropdown label="Role" class="role" :options="['user', 'system', 'assistant']" v-model="message.role" />
        <!-- <input v-model="message.text" class="message-input" placeholder="Enter message"> -->
        <Textarea label="Message" v-model="message.text" class="message-input" placeholder="Enter message" />
      </div>
      <button class="add-message-button" @click="addMessage">Add Message</button>
    </div>

    <div v-else class="run-container">
      <div class="input-container" v-for="(input, index) in inputs" :key="index">
        <label>{{ input.placeholder }}</label>
        <input v-model="input.value" class="input-field">
      </div>
      <button class="run-button" @click="run">Run</button>
      <div class="output-container">
        <label>Output:</label>
        <textarea readonly v-model="output" class="output-field"></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">

.app-container {
  @apply p-4;
}

.tab-container {
  @apply flex border-gray-200;
}

.tab-button {
  @apply px-4 py-2 bg-white rounded-t;
}

.tab-button.active {
  @apply border-l border-t border-r 
}

.tab-button:not(.active) {
  @apply border-b;
}

.compose-container, .run-container {
  @apply mt-4;
}

.message-container, .input-container {
  @apply flex space-x-2 items-center mb-2;
}


.role {
  @apply w-40;
}

.add-message-button, .run-button {
  @apply px-4 py-2 bg-blue-500 text-white rounded mt-2;
}

.output-container {
  @apply mt-4;
}
</style>
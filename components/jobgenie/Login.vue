<template>
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <form @submit.prevent="startChat">
      <div class="mb-4">
        <label class="form-label" for="username">
          Hi there! What’s your name?
        </label>
        <input class="form-input" id="username" type="text" placeholder="Just the first name pls" v-model="username">
        <p class="form-hint">We’ll use your name to create your personalized description to help you craft your dream job.</p>
      </div>
      <div class="mb-4">
        <label class="form-label" for="apikey">
          What’s your OpenAI API Key?
        </label>
        <input class="form-input" id="apikey" type="password" placeholder="sk-..." v-model="apiKey">
        <p class="form-hint">We need your API key to make requests to OpenAI. We don’t store your API key anywhere, it’s only saved in your local storage. The app doesn’t have a server, so your API key is safe with you.</p>
      </div>
      <div class="flex items-center justify-between">
        <Button :disabled="!username || !apiKey" type="submit" @click="startChat" caption="Start Crafting" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  
import Button from '~/components/shared/Button.vue'
import { Credentials } from './Credentials';

  const username = ref('')
  const apiKey = ref('')

  const emit = defineEmits<{
    login: [Credentials]
  }>();

  const startChat = () => {
    if (username.value && apiKey.value) {
      emit('login', { username: username.value, apiKey: apiKey.value })
    }
  }
  
</script>

<style scoped lang="postcss">
  .form-label {
    @apply block text-gray-700 text-sm font-bold mb-2;
  }

  .form-input {
    @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
  }

  .form-input:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }

  .form-hint {
    @apply text-gray-600 pt-3 text-xs italic;
  }
</style>
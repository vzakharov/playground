<template>
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <form @submit.prevent="startChat">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
          Hi there! What’s your name?
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Your name" v-model="username">
        <p class="text-gray-600 pt-3 text-xs italic">We’ll use your name to create your personalized description to help you craft your dream job.</p>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="apikey">
          Please enter your OpenAI API Key
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="apikey" type="text" placeholder="Your OpenAI API Key" v-model="apiKey">
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
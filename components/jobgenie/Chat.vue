<template>
  <div>
    <div v-for="(message, index) in messages" :key="index" class="mb-2 msg-container">
      <div :class="message.role === 'user' ? 'msg msg-user' : 'msg msg-assistant'">
        {{ message.content }}
      </div>
    </div>
    <div v-if="messages[messages.length - 1]?.role === 'user'" class="msg msg-assistant animate-pulse">
      ...
    </div>
    <div v-else class="input-container">
      <input v-model="userMessage" @keyup.enter="sendMessage" type="text" placeholder="Type your message here..." class="input-box">
      <button @click="sendMessage" class="send-btn">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ChatMessage } from '~/lib/vovas-openai';

  const props = defineProps({
    messages: {
      type: Array as () => ChatMessage[],
      required: true
    }
  });

  let userMessage = '';

  function sendMessage() {
    if (userMessage.trim() !== '') {
      props.messages.push({ content: userMessage, role: 'user' });
      userMessage = '';
    }
  }
  
</script>

<style scoped lang="postcss">

  .msg-container {
    @apply flex flex-col w-full;
  }

  .msg {
    @apply text-white p-2 rounded mb-2;
    max-width: 60%;
  }

  .msg-user {
    @apply bg-blue-500 self-end;
  }

  .msg-assistant {
    @apply bg-gray-500 self-start;
  }

  .input-container {
    @apply flex justify-end items-center mt-2;
  }

  .input-box {
    @apply border border-gray-300 rounded p-2 flex-grow mr-2;
  }

  .send-btn {
    @apply bg-green-600 text-white px-4 py-2 rounded cursor-pointer;
  }

</style>
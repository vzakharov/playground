<template>
  <div>
    <div v-for="(message, index) in messages" :key="index" class="mb-2 message-container">
      <div v-if="message.role === 'user'" class="msg msg-user">
        {{ message.content }}
      </div>
      <div v-else class="msg msg-assistant">
        {{ message.content }}
      </div>
    </div>
    <div v-if="messages[messages.length - 1]?.role === 'user'" class="msg msg-assistant animate-pulse">
      ...
    </div>
  </div>
</template>

<script setup lang="ts">

import { ChatCompletionRequestMessage } from 'openai';

  const props = defineProps({
    messages: {
      type: Array as () => ChatCompletionRequestMessage[],
      required: true
    }
  });
  
</script>

<style scoped lang="postcss">

  .message-container {
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

</style>
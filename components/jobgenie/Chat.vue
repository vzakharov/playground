<template>
  <div>
    <div v-for="(message, index) in messages" :key="index" class="mb-2">
      <div v-if="message.role === 'user'" class="msg msg-user">
        {{ message.content }}
      </div>
      <div v-else class="msg msg-assistant">
        {{ message.content }}
      </div>
    </div>
    <div v-if="messages[messages.length - 1]?.role === 'user'" class="msg-assistant animate-pulse">
      <p class="text-white">...</p>
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

  .msg {
    @apply p-4 rounded-lg text-white;
  }

  .msg-user {
    @apply bg-blue-500 float-right;
  }

  .msg-assistant {
    @apply bg-gray-500 float-left;
  }

</style>
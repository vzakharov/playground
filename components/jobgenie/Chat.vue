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

</style>
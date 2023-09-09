<template>
  <div>
    <div v-for="(message, index) in messages" :key="index">
      <p v-if="message.role === 'user'">User: {{ message.content }}</p>
      <p v-else>Assistant: {{ message.content }}</p>
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
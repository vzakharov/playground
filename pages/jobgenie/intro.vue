<template>
  <div class="container mx-auto px-4">
    <div class="flex flex-col items-center justify-center min-h-screen">
      <div class="w-full max-w-md">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <EnterName v-if="!username" @nameEntered="username = $event" />
          <Chat v-else v-bind="{ messages }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ChatCompletionRequestMessage } from 'openai';
import { ref, watch } from 'vue';
import Chat from '~/components/jobgenie/Chat.vue';
import EnterName from '~/components/jobgenie/EnterName.vue';

  const username = ref('');
  const messages = ref<ChatCompletionRequestMessage[]>([]);

  watch(username, (newUsername, oldUsername) => {
    if (newUsername && newUsername !== oldUsername) {
      messages.value.push({ role: 'user', content: `Hi, I’m ${newUsername}` });
    }
  });

</script>
<template>
  <div class="container mx-auto px-4">
    <div class="flex flex-col items-center justify-center min-h-screen">
      <div class="w-full max-w-md">
        <Login v-if="!username || !process.env.apiKey" @="{ login }" />
        <Chat v-else :="{ messages }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import _ from 'lodash';

import { Credentials } from 'components/jobgenie/Credentials';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import Chat from '~/components/jobgenie/Chat.vue';
import Login from '~/components/jobgenie/Login.vue';
import { generateResponse } from '~/lib/jobgenie';

  const username = ref('');

  const messages = reactive<ChatCompletionMessageParam[]>([]);

  const process = useWindowProcess();

  function login(c: Credentials) {
    username.value = c.username;
    process.env.OPENAI_API_KEY = c.apiKey;
  }

  watch(username, (newUsername, oldUsername) => {
    if (newUsername && newUsername !== oldUsername) {
      messages.splice(0, messages.length, { role: 'user', content: `Hi, I’m ${newUsername}` });
    }
  });

  watch(messages, async () => {
    const lastMessage = _.last(messages);
    if (lastMessage && lastMessage.role === 'user') {
      const response = await generateResponse('interview', messages);
      messages.push({ role: 'assistant', content: response });
    }
  });

</script>
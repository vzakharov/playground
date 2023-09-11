<template>
  <div class="container mx-auto px-4">
    <div class="flex flex-col items-center justify-center min-h-screen">
      <div class="w-full max-w-3xl">
        <Login v-if="!username || !process.env.OPENAI_API_KEY" @="{ login }" />
        <Chat v-else :="{ messages }" @="{ sendMessage }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import _ from 'lodash';
import { useLocalReactive, useLocalRef } from 'use-vova';

import { Credentials } from 'components/jobgenie/Credentials';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import Chat from '~/components/jobgenie/Chat.vue';
import Login from '~/components/jobgenie/Login.vue';
import { generateResponse } from '~/lib/jobgenie';
import { says } from '~/lib/vovas-openai';

  const username = useLocalRef('username', '');

  const messages = useLocalReactive<ChatCompletionMessageParam[]>('messages', []);

  const process = useWindowProcess();

  function login(c: Credentials) {
    username.value = c.username;
    process.env.OPENAI_API_KEY = c.apiKey;
  }

  function sendMessage(content: string) {
    messages.push(says.user(content));
  }

  watch(messages, async () => {
    const lastMessage = _.last(messages);
    if (lastMessage && lastMessage.role === 'user') {
      const response = await generateResponse('interview', messages);
      messages.push(says.assistant( response ));
    }
  }, { immediate: true });

  watch(username, (newUsername, oldUsername) => {
    if (!messages.length && newUsername && newUsername !== oldUsername) {
      messages.splice(0, messages.length, says.user(`Hi, I’m ${newUsername}`) );
    }
  }, { immediate: true });

</script>
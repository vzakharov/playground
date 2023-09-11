<template>
  <div>
    <div v-for="(message, index) in messages" :key="index" class="mb-2 msg-container">
      <div :class="message.role === 'user' ? 'msg msg-user' : 'msg msg-assistant'">
        {{ message.content }}
      </div>
    </div>
    <div v-if="lastMessageIsFromUser" class="msg msg-assistant animate-pulse">
      ...
    </div>
    <form v-if="!lastMessageIsFromUser" @submit.prevent="sendMessage" class="input-container">
      <input v-model="userMessage" type="text" placeholder="Type your message here..." class="input-box">
      <button v-if="!!userMessage" type="submit" class="send-btn">↑</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useLocalReactive } from 'use-vova';


import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { generateResponse } from '~/lib/jobgenie';
import { GenerateException, says } from '~/lib/vovas-openai';
import { username } from './username';

  const { type } = defineProps<{
    type: 'interview'
  }>();

  const messages = useLocalReactive<ChatCompletionMessageParam[]>(`${type}Messages`, []);

  const lastMessageIsFromUser = computed(() => {
    const lastMessage = _.last(messages);
    return lastMessage && lastMessage.role === 'user';
  });

  const userMessage = ref('');

  function sendMessage() {
    const content = userMessage.value;
    if (content.trim() !== '') {
      messages.push(says.user(content));
      userMessage.value = '';
    }
  }

  watch(username, (newUsername, oldUsername) => {
    if (!messages.length && newUsername && newUsername !== oldUsername) {
      messages.splice(0, messages.length, says.user(`Hi, I’m ${newUsername}`) );
    }
  }, { immediate: true });

  watch(messages, async () => {
    const lastMessage = _.last(messages);
    if (lastMessage && lastMessage.role === 'user') {
      try {
        const response = await generateResponse(type, messages);
        messages.push(says.assistant( response ));
      } catch (e: any) {
        if ( e instanceof GenerateException ) {
          // Remove last message and give an alert
          messages.pop();
          alert(e.message);
        }
      }
    }
  }, { immediate: true });

  
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
    @apply bg-blue-600 text-white px-4 py-2 rounded-full cursor-pointer;
  }

</style>
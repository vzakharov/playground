<template>
  <div>
    <button @click="startOver" class="start-over-btn-outline fixed top-0">Start Over</button>
    <div v-for="(message, index) in messages" :key="index" class="mb-2 msg-container">
      <div :class="message.role === 'user' ? 'msg msg-user' : 'msg msg-assistant'">
        {{ message.content }}
      </div>
    </div>
    <div v-if="generating.inProgress" class="msg msg-assistant animate-pulse">
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
import { Resolvable, also } from 'vovas-utils';

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

function startOver() {
  if (window.confirm("Are you sure you want to start over? All current messages will be lost.")) {
    messages.splice(0, messages.length);
  }
}

const generating = reactive(new Resolvable({ startResolved: true }));

watch(messages, async () => {

  await generating.promise;

  const lastMessage = _.last(messages) 
    ?? also(
      says.user(`Hi, I’m ${username.value}`), 
      m => messages.push(m)
    );

  if ( lastMessage.role === 'user' ) {
    try {
      generating.start();
      const response = await generateResponse(type, messages);
      messages.push(says.assistant(response));
    } catch (e: any) {
      if (e instanceof GenerateException) {
        // Remove last message and give an alert
        messages.pop();
        alert(e.message);
      }
    } finally {
      generating.resolve();
    }
  }
}, { immediate: true });
</script>

<style scoped lang="postcss">
.msg-container {
  @apply flex flex-col w-full;
}

.msg {
  @apply text-white p-2 px-4 rounded mb-2;
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

.start-over-btn-outline {
  @apply border border-gray-500 text-gray-500 px-2 py-1 rounded-full cursor-pointer mt-2 ml-2;
}

.start-over-btn-outline:hover {
  @apply bg-gray-500 text-white;
}

.start-over-btn-outline:focus {
  @apply outline-none;
}
</style>
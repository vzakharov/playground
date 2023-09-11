<template>
  <div>
    <Button rounded small outline class="fixed top-0 mt-2 ml-2" 
      caption="↺ Start over"
      @click="m.startOver" 
    />
    <div v-for="(message, index) in m.messages" :key="index" class="mb-2 msg-container">
      <div :class="message.role === 'user' ? 'msg msg-user' : 'msg msg-assistant'">
        {{ message.content }}
      </div>
      <Button v-if="message.role === 'assistant'" small rounded outline class="ml-2 self-start" 
        caption="↺"
        @click="m.regenerate(message)"
      />
      <Button v-if="index && message.role === 'user'" small rounded outline class="ml-2 self-end" 
        caption="✎"
        @click="m.editMessage(message)"
      />
    </div>
    <div v-if="generating.inProgress" class="msg msg-assistant animate-pulse">
      ...
    </div>
    <form v-if="!m.lastMessageIsFromUser" @submit.prevent="m.sendMessage" class="input-container">
      <input type="text" class="input-box"
        v-model="m.config.userMessage.value"
        placeholder="Type your message here..."
        ref="userInput"
      >
      <Button rounded small
        v-if="!!m.config.userMessage.value" 
        type="submit" 
        caption="↑"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useLocalReactive } from 'use-vova';
import { Resolvable } from 'vovas-utils';
import { username } from '~/components/jobgenie/username';
import Button from '~/components/shared/Button.vue';
import { ChatMessage, says } from '~/lib/vovas-openai';
import { watchMessages } from './watchMessages';
import { MessageManipulator } from './manipulations';

  const { type } = defineProps<{
    type: 'interview'
  }>();

  const messages = useLocalReactive<ChatMessage[]>(`${type}Messages`, []);

  const userMessage = ref('');

  const generating = reactive(new Resolvable({ startResolved: true }));

  watchMessages({
    messages,
    generating,
    type,
    username
  });

  const userInput = ref<HTMLInputElement | null>(null);

  const m = new MessageManipulator(messages, {
    userMessage,
    userInput,
  });

</script>

<style scoped lang="postcss">
.msg-container {
  @apply flex flex-col w-full;
}

.msg {
  @apply text-white p-2 px-4 rounded mb-2;
  max-width: 90%;
}

.msg-user {
  @apply bg-blue-500 self-end;
}

.msg-assistant {
  @apply bg-gray-500 self-start;
}

.input-container {
  @apply flex justify-end items-center mt-4;
}

.input-box {
  @apply border border-gray-300 rounded p-2 flex-grow mr-2;
}

</style>
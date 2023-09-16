<script setup lang="ts">

  import { Marked } from '@ts-stack/markdown';
  import _ from 'lodash';
  import { addProperties } from 'vovas-utils';
  import Button from '~/components/shared/Button.vue';
  import Card from '~/components/shared/Card.vue';
  import { isBy } from '~/lib/vovas-openai';
  import { createChatController, getOrCreateChatController } from './controller';
  import { data, dataLoadedTimestamp } from '../data';
  import { ChatType } from '~/lib/jobgenie'

  const { type } = defineProps<{
    type: ChatType;
  }>();

  // const c = getOrCreateChatController(type);
  const c = computed(() => {
    dataLoadedTimestamp.value;      // i.e. we want to recompute this whenever data is loaded
    return createChatController(type)
  });

  const { userMessage, msExpected } = c.value;

  addProperties(window, { _, c, data});

</script>

<template>
  <div>
    <div v-for="(message, index) in c.messages" :key="index" class="mb-2 msg-container">
      <div :class="isBy.user(message) ? 'msg msg-user' : 'msg msg-assistant'">
        <span v-html="Marked.parse(message.content)" />
        <div v-if="message.assets">
          <Card v-for="(content, title) in message.assets" :key="title" :="{ title, content }" />
        </div>
            
            <!--
            <Button small rounded class="ml-2 self-start" 
              :outline="!!data.dna"
              :caption="dnaJustSet === quote ? '✓' : 'Set as DNA'"
              @click="setDna(quote)"
            /> -->
      </div>
      <Button v-if="isBy.assistant(message)" small rounded outline class="ml-2 self-start" 
        caption="↺"
        @click="c.regenerate(message)"
      />
      <Button v-if="index && isBy.user(message)" small rounded outline class="ml-2 self-end" 
        caption="✎"
        @click="c.editMessage(message)"
      />
    </div>
    <div v-if="c.generating.inProgress" class="msg msg-assistant animate-pulse"
      v-text="msExpected ? `Generating (~${Math.round(msExpected / 1000)}s)...` : 'Generating...'"
    />
    <form v-if="!c.lastMessageIsFromUser" @submit.prevent="c.sendMessage" class="input-container">
      <textarea class="input-box"
        v-model="userMessage"
        placeholder="Type your message here..."
        ref="userInput"
      />
      <Button rounded small
        v-if="!!userMessage" 
        type="submit" 
        caption="↑"
      />
    </form>
    <div class="p-2 mt-4 fixed bottom-5 right-5 bg-white shadow rounded">
      <!-- Start over -->
      <Button rounded small outline gray class="me-2"
        caption="↺ Start over"
        @click="c.startOver()" 
      />
    </div>
  </div>
</template>

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
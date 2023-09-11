<template>
  <div>
    <Button rounded small outline class="fixed top-0 mt-2 ml-2" 
      caption="↺ Start over"
      @click="c.startOver" 
    />
    <div v-for="(message, index) in c.messages" :key="index" class="mb-2 msg-container">
      <div :class="isBy.user(message) ? 'msg msg-user' : 'msg msg-assistant'">
        <span v-if="!c.hasQuotes(message)" v-html="Marked.parse(message.content)" />
        <div v-else v-for="({ leadIn, quote}, index) in c.getQuotes(message)" :key="index">
          <p v-if="leadIn" v-html="Marked.parse(leadIn)" />
          <blockquote v-if="quote" v-html="Marked.parse(quote)" />
        </div>
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
    <div v-if="c.generating.inProgress" class="msg msg-assistant animate-pulse">
      ...
    </div>
    <form v-if="!c.lastMessageIsFromUser" @submit.prevent="c.sendMessage" class="input-container">
      <input type="text" class="input-box"
        v-model="c.userMessage.value"
        placeholder="Type your message here..."
        ref="userInput"
      >
      <Button rounded small
        v-if="!!c.userMessage.value" 
        type="submit" 
        caption="↑"
      />
    </form>
  </div>
</template>

<script setup lang="ts">

  import { Marked } from '@ts-stack/markdown';
  import _ from 'lodash';
  import { addProperties } from 'vovas-utils';
  import Button from '~/components/shared/Button.vue';
  import { isBy } from '~/lib/vovas-openai';
  import { ChatController } from './controller';

  const { type } = defineProps<{
    type: 'interview'
  }>();

  
  const c = new ChatController(type);
  addProperties(window, { _, c});

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

<style lang="postcss">
.msg blockquote {
  @apply border-l-4 border-gray-500 bg-gray-100 text-gray-700 p-3 px-5 my-4 italic;
}
</style>
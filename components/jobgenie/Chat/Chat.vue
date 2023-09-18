<script setup lang="ts" generic="T extends ChatType">

  import { Marked } from '@ts-stack/markdown';
  import _ from 'lodash';
  import { addProperties } from 'vovas-utils';
  import Button from '~/components/shared/Button.vue';
  import Card from '~/components/shared/Card.vue';
  import { isBy } from '~/lib/vovas-openai';
  import { renewChatController } from './controller';
  import { data } from '../data';
  import { ChatType, areLeftoversForMessage, assetCaptions } from '~/lib/jobgenie'
  import { userMessage, generating, userInput, msExpected, leftovers } from '../refs';

  const { type } = defineProps<{
    type: T;
  }>();

  const c = renewChatController(type);

  addProperties(window, { _, c, data});

</script>

<template>
  <div>
    <div v-for="(message, index) in c.messages" :key="index" class="mb-2 msg-container">
      <div :class="isBy.user(message) ? 'msg msg-user' : 'msg msg-assistant'">
        <span v-html="Marked.parse(message.content)" />
        <div v-if="message.assets">
          <Card v-for="(content, title) in message.assets" :key="title" :="{ 
            title: assetCaptions[title], 
            content 
          }"/>
        </div>
      </div>
      <div :class="`flex self-${isBy.user(message) ? 'end' : 'start'}`">
        <Button v-if="leftovers.results.length && areLeftoversForMessage(leftovers, message)" small rounded outline class="ml-2 self-start"
          :caption="`${leftovers.selectedIndex}/${leftovers.results.length + 1}`"
          tooltip="Loop through alternatives"
          @click="c.loopLeftovers(message)"
        />
        <Button v-if="isBy.assistant(message)" small rounded outline class="mx-1" 
          caption="↺"
          tooltip="Regenerate"
          @click="c.regenerate(message)"
        />
        <Button v-if="index && isBy.user(message)" small rounded outline class="mx-1" 
          caption="✎"
          tooltip="Edit"
          @click="c.editMessage(message)"
        />
        <Button v-if="message.assets" rounded small outline gray class="mx-1"
          caption="Accept"
          tooltip="Set this asset globally for any relevant generations"
        />
      </div>
    </div>
    <div v-if="generating.inProgress" class="msg msg-assistant animate-pulse"
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
        @click="c.startOver" 
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

<style lang="postcss">

  /* We’re not making these scoped because the tags are created dynamically, so Vue doesn’t know about them. */

  .msg p {
    @apply pt-2 pb-2;
  }

  .msg ol {
    @apply list-decimal pl-2 pt-2;
  }

  .msg ul {
    @apply list-disc pl-2 pt-2;
  }

  .msg li {
    @apply pb-2;
  }

</style>
<script setup lang="ts" generic="T extends ChatType">

import _ from 'lodash';
import { addProperties } from 'vovas-utils';
import Button from '~/components/shared/Button.vue';
import Textarea from '~/components/shared/Textarea.vue';
import { refForInstance } from '~/components/shared/utils';
import { AppChatMessage, ChatType, Resolvable } from '~/lib/jobgenie';
import { data } from '../data';
import { globalState } from '../state';
import Message from './Message.vue';
import { renewChatController } from './controller';

  const { type } = defineProps<{
    type: T;
  }>();

  const generating = ref<Resolvable<AppChatMessage<T, 'assistant'>>>();
  const dataLastLoaded = ref(Date.now());
  const msExpected = ref<number>();

  const { userMessage } = toRefs(globalState);
  const userMessageComponent = refForInstance(Textarea);

  const c = renewChatController(type, {
    generating,
    userMessage,
    userMessageComponent,
    msExpected
  });

  addProperties(window, { _, c, data, userMessageComponent, globalState });

  watch(userMessageComponent, component => {
    if ( !component ) return;
    const { textarea } = component;
    nextTick(() => {
      if ( !textarea ) return;
      textarea.scrollIntoView();
      textarea.focus();
    });
  });
  

</script>

<template>
  <div>
    <Message v-for="message in c.messages" :key="message.id" :="{ c, message }"/>
    <div v-if="generating?.inProgress" class="msg msg-assistant animate-pulse"
      v-text="msExpected ? `Generating (~${Math.round(msExpected / 1000)}s)...` : 'Generating...'"
    />
    <form v-if="!c.lastMessageIsFromUser" @submit.prevent="c.sendMessage" class="input-container">
      <Textarea class="input-box"
        id="userMessage"
        submit-on-enter
        v-model="userMessage"
        placeholder="Shift+Enter for a new line"
        ref="userMessageComponent"
        @submit="c.sendMessage()"
      />
      <Button primary rounded small
        v-if="!!userMessage"
        type="submit" 
        caption="↑"
      />
    </form>
  </div>
</template>

<style scoped lang="postcss">

.msg {
  @apply text-white p-2 px-4 rounded mb-2;
  max-width: 90%;
}

.msg-assistant {
  @apply bg-gray-500 self-start;
}

.input-container {
  @apply flex justify-end items-start mt-4;
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
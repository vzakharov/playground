<script setup lang="ts" generic="S extends Schema, T extends Tool<S>">

import _ from 'lodash';
import { addProperties } from 'vovas-utils';
import Button from '~/components/shared/Button.vue';
import Textarea from '~/components/shared/Textarea.vue';
import { refForInstance } from '~/components/shared/utils';
import { data } from '../data';
import { globalState } from '../state';
import Message from './Message.vue';
import { renewChatController } from './controller';
import { Genie, GenieMessage, Schema, Tool } from '~/lib/genie';
import { Resolvable } from '~/lib/utils';

  const { genie } = defineProps<{
    genie: Genie<S, T>;
  }>();

  const generating = ref<Resolvable<GenieMessage<S, T, 'assistant'>>>();
  const dataLastLoaded = ref(Date.now());
  const msExpected = ref<number>();

  const { userMessage } = toRefs(globalState);
  const userMessageComponent = refForInstance(Textarea);


  // const c = renewChatController(type, {
  //   generating,
  //   userMessage,
  //   userMessageComponent,
  //   msExpected
  // });
  const c = new genie.ChatController({
    state: {
      generating,
      userMessage,
      userMessageComponent,
      msExpected
    }
  });

  addProperties(window, { _, genie, c, data, userMessageComponent, globalState });

  watch(userMessageComponent, component => {
    if ( !component ) return;
    const { textarea } = component;
    nextTick(() => {
      if ( !textarea ) return;
      textarea.scrollIntoView();
      textarea.focus();
    });
  });

  const countIrrelevantMessages = computed(() => {
    return c.countIrrelevantMessages();
  });

  const showIrrelevantMessages = ref(false);
  const irrelevanceNote = ref<[HTMLDivElement]>();
  // (Tuple because we technically create multiple notes due to v-for)
  function toggleIrrelevantMessages() {
    showIrrelevantMessages.value = !showIrrelevantMessages.value;
    nextTick(() => {
      irrelevanceNote.value?.[0].scrollIntoView();
    });
  }

</script>

<template>
  <div>
    <div v-for="( message, index ) in c.messages" :key="message.id"
      :class="{ 
        'flex flex-col': true,
        'msg-irrelevant': index < countIrrelevantMessages,
        hidden: !showIrrelevantMessages && index < countIrrelevantMessages
      }"
    >
      <div v-if="index === countIrrelevantMessages" class="irrelevance-note"
        ref="irrelevanceNote"
        v-text="
          showIrrelevantMessages
           ? 'Messages above this line are not taken into account when generating the response (click to hide)'
           : 'Messages not taken into account when generating the response are hidden (click to show)'
        "
        @click="toggleIrrelevantMessages"
      />
      <Message :="{ c, message }"/>
    </div>
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

.msg-irrelevant {
  @apply opacity-70;
}

.irrelevance-note {
  @apply text-xs text-gray-400 mt-4 mb-5 self-center cursor-pointer;
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
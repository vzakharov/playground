<script setup lang="ts" generic="T extends AnyBoundTool">

import _ from 'lodash';
import { addProperties } from 'vovas-utils';
import Button from '~/components/shared/Button.vue';
import Textarea from '~/components/shared/Textarea.vue';
import { refForInstance } from '~/components/shared/utils';
import { $GenieChatId, AnyBoundTool, GenieMessage, branded } from '~/lib/genie';
import { Resolvable, refsToReactive } from '~/lib/utils';
import { globalData } from '../data';
import { globalState } from '../state';
import Message from './Message.vue';

const { tool } = defineProps<{
  tool: T;
}>();

const generating = ref<Resolvable<GenieMessage<T, 'assistant'>>>();
const msExpected = ref<number>();
const userMessage = toRefs(globalState).userMessage;
const userMessageComponent = refForInstance(Textarea);

const state = refsToReactive({ generating, msExpected, userMessage, userMessageComponent });

const c = tool.chatController({
  state, 
  chatId: branded<$GenieChatId>(tool.id), // TODO: Implement multiple chat ids per tool
});

addProperties(window, { _, c, data: globalData, state, globalState });

watch(userMessageComponent, component => {
  if ( !component ) return;
  const { textarea } = component;
  nextTick(() => {
    if ( !textarea ) return;
    textarea.scrollIntoView();
    textarea.focus();
  });
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
        'msg-irrelevant': index < c.countIrrelevantMessages,
        hidden: !showIrrelevantMessages && index < c.countIrrelevantMessages
      }"
    >
      <div v-if="index === c.countIrrelevantMessages" class="irrelevance-note"
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
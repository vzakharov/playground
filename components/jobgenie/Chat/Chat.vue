<script setup lang="ts" generic="T extends ChatType">

import { Marked } from '@ts-stack/markdown';
import _ from 'lodash';
import { addProperties } from 'vovas-utils';
import Button from '~/components/shared/Button.vue';
import Card from '~/components/shared/Card.vue';
import Textarea from '~/components/shared/Textarea.vue';
import { AppChatMessage, ChatType, Resolvable, areLeftoversForMessage, getAssetCaptions } from '~/lib/jobgenie';
import { isBy } from '~/lib/vovas-openai';
import { data } from '../data';
import { isActiveAssetFor } from '../refs';
import { leftovers, globalState } from '../state';
import { renewChatController } from './controller';
import { refForInstance } from '~/components/shared/utils';

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

  addProperties(window, { _, c, data, userMessageComponent });

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
    <div v-for="(message, index) in c.messages" :key="index" class="mb-2 msg-container">
      <div 
        :class="{
          [`msg msg-${message.role}`]: true,
          'msg-picked-assets': isActiveAssetFor(c, message)
        }"
        :title="isActiveAssetFor(c, message) ? 'This asset will be used globally for any relevant generations' : ''"
      >
        <span v-html="Marked.parse(message.content)" />
        <div v-if="message.assets">
          <Card v-for="(content, title) in message.assets" :key="title" :="{ 
            title: getAssetCaptions(c.type)[title],
            content 
          }"/>
        </div>
        <div :class="`flex justify-${isBy.user(message) ? 'end' : 'start'}`">
          <Button v-if="leftovers.results.length && areLeftoversForMessage(leftovers, message)" small rounded outline class="mx-1"
            :caption="`${leftovers.selectedIndex}/${leftovers.results.length + 1}`"
            tooltip="Loop through alternatives"
            @click="c.cycleLeftovers(message)"
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
          <template v-if="message.assets">
            <Button v-if="!isActiveAssetFor(c, message)" rounded small outline class="mx-1"
              caption="Use this"
              tooltip="Set this asset globally for any relevant generations"
              @click="message.assetsPickedAt = Date.now()"
            />
          </template>
        </div>
      </div>
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
.msg-container {
  @apply flex flex-col;
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

.msg-picked-assets {
  /* @apply bg-green-500; */
  /* Can we make it slightly grayish-green? */
  background-color: #357a38;
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
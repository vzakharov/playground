<script setup lang="ts" generic="T extends ChatType">

import { Marked } from '@ts-stack/markdown';
import { isBy } from '~/lib/vovas-openai';
import { getAssetCaptions, areLeftoversForMessage, ChatType, AppChatMessage } from '~/lib/jobgenie';
import Button from '~/components/shared/Button.vue';
import Card from '~/components/shared/Card.vue';
import { isActiveAssetFor } from '../refs';
import { ChatController } from './controller';
import { leftovers } from '../state';

const props = defineProps<{
  message: AppChatMessage<T>,
  c: ChatController<T>
}>();

const { message, c } = toRefs(props);

</script>

<template>
  <div class="msg-container">
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
        <Button v-if="isBy.user(message)" small rounded outline class="mx-1" 
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
</template>

<style scoped lang="postcss">
.msg {
  @apply text-white p-2 px-4 rounded mb-2;
  max-width: 90%;
}

.msg-container {
  @apply flex flex-col mb-2;
}


.msg-user {
  @apply bg-blue-500 self-end;
}

.msg-assistant {
  @apply bg-gray-500 self-start;
}

.msg-picked-assets {
  background-color: #357a38;
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
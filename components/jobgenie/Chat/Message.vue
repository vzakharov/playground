<script setup lang="ts" generic="T extends ChatType">

import { Marked } from '@ts-stack/markdown';
import ButtonGroup from '~/components/shared/ButtonGroup.vue';
import Card from '~/components/shared/Card.vue';
import { AppChatMessage, ChatType, allTrue, getAssetCaptions, areLeftoversForMessage, getLeftovers } from '~/lib/jobgenie';
import { isBy } from '~/lib/vovas-openai';
import { isActiveAssetFor } from '../refs';
import { globalState as state } from '../state';
import { ChatController } from './controller';
import TextModal from '~/components/shared/TextModal.vue';
import { refForInstance } from '~/components/shared/utils';

const props = defineProps<{
  message: AppChatMessage<T>,
  c: ChatController<T>
}>();

const buttons = computed(() => {
  
  const leftovers = getLeftovers(state, props.c.type)
  const { message, c } = props;

  return [
    leftovers.results.length && isBy.assistant(message) && areLeftoversForMessage(leftovers, message) && {
      caption: `${leftovers.selectedIndex}/${leftovers.results.length + 1}`,
      tooltip: 'Loop through alternatives',
      onClick: () => c.cycleLeftovers(message)
    },
    isBy.assistant(message) && {
      caption: '↺',
      tooltip: 'Regenerate',
      onClick: () => c.regenerate(message)
    },
    isBy.user(message) && {
      caption: '✎',
      tooltip: 'Edit',
      onClick: () => c.editMessage(message)
    },
    message.assets && !isActiveAssetFor(c, message) && {
      caption: 'Use this',
      tooltip: 'Set this asset globally for any relevant generations',
      onClick: () => message.assetsPickedAt = Date.now()
    }
  ]

});

const editMessageModal = refForInstance(TextModal);

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
      <span 
        v-html="Marked.parse(message.content)" 
        @dblclick="editMessageModal!.show()"
      />
      <div v-if="message.assets">
        <Card 
          v-for="(content, title) in message.assets" :key="title"
          :="{ 
            title: getAssetCaptions(c.type)[title],
            modelValue: content,
            editOnDoubleClick: true
          }"
          @update:model-value="content => message.assets![title] = content"
        />
        <!-- TODO: Make it possible to use v-model -->
      </div>
      <div :class="`flex justify-${isBy.user(message) ? 'end' : 'start'}`">
        <ButtonGroup :default-props="allTrue('rounded', 'small', 'outline')"
          :="{ buttons }"
        />
      </div>
    </div>
  </div>
  <TextModal
    ref="editMessageModal"
    v-model="message.content"
    title="Edit message"
    description="You can edit the message here. You can also use Markdown."
  />
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

  code {
    @apply overflow-auto bg-gray-800 text-gray-300 rounded-lg p-3 block whitespace-pre-wrap m-3 p-5;
    max-height: 20rem;
}

</style>
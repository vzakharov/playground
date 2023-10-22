<script setup lang="ts" generic="T extends AnyTool" >

import { Marked } from '@ts-stack/markdown';
import Button from '~/components/shared/Button.vue';
import ButtonGroup from '~/components/shared/ButtonGroup.vue';
import Card from '~/components/shared/Card.vue';
// import { AppChatMessage, ChatType, allTrue, getAssetCaptions, areLeftoversForMessage, getLeftovers } from '~/lib/jobgenie';
import _ from 'lodash';
import TextModal from '~/components/shared/TextModal.vue';
import { refForInstance } from '~/components/shared/utils';
import { AnyTool, Chat, GenieMessage } from '~/lib/genie';
import { isBy } from '~/lib/vovas-openai';
import { genie } from '../refs';

const props = defineProps<{
  message: GenieMessage<T>,
  c: Chat<T['id'], T>
}>();

const { message, c } = props;

const buttons = computed(() => {
  
  const { leftovers } = c;

  return [
    ...isBy.assistant(message) ? [
      ...leftovers.results.length && c.areLeftoversForMessage(message) ? [
        {
          caption: `${leftovers.activeMessageOriginalIndex}/${leftovers.results.length + 1}`,
          tooltip: 'Loop through alternatives',
          onClick: () => c.cycleLeftovers(message)
        },
        {
          caption: '🗑',
          tooltip: 'Delete this alternative',
          onClick: () => c.replaceActiveMessageWithLeftover(message)
        }

      ] : [],
      {
        caption: '↺',
        tooltip: 'More alternatives',
        onClick: () => c.regenerate(message)
      },
      message === c.messageWithActiveAssets && {
        caption: 'Use this',
        tooltip: 'Set this asset globally for any relevant generations',
        onClick: () => message.assetsPickedAt = Date.now()
      }
    ] : isBy.user(message) ? [
      {
        caption: '✎',
        tooltip: 'Edit',
        onClick: () =>
          (
            message === _.last(c.messages)
            || window.confirm('This will delete all messages after this one. Are you sure?') 
          ) && c.editMessage(message)
      },
    ] : []
  ]

});

const editMessageModal = refForInstance(TextModal);

const justCopied = ref<string>();
function copyToClipboard(content: string) {
  navigator.clipboard.writeText(content);
  justCopied.value = content;
  setTimeout(() => justCopied.value = '', 1000);
};

</script>

<template>
  <div class="msg-container">
    <div 
      :class="{
        [`msg msg-${message.role}`]: true,
        'msg-picked-assets': message === c.messageWithActiveAssets
      }"
      :title="message === c.messageWithActiveAssets ? 'This asset will be used globally for any relevant generations' : ''"
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
        >
        <!-- TODO: Make it possible to use v-model -->
        <!-- Copy to clipboard -->
          <template #footer>
            <Button rounded small outline
              :caption="justCopied === content ? '✓' : '⧉'"
              @click="copyToClipboard(content)"
            />
          </template>
        </Card>
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
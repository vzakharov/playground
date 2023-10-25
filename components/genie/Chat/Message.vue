<script setup lang="ts" generic="T extends AnyTool" >

import { Marked } from '@ts-stack/markdown';
import { ensure } from 'vovas-utils';
import Button from '~/components/shared/Button.vue';
import ButtonGroup from '~/components/shared/ButtonGroup.vue';
import Card from '~/components/shared/Card.vue';
import TextModal from '~/components/shared/TextModal.vue';
import { refForInstance } from '~/components/shared/utils';
import { AnyTool, AssetValues, Chat, GenieMessage, assetCaptions } from '~/lib/genie';
import { useMessageButtons } from '~/lib/genie-vue';
import { allTrue } from '~/lib/utils';
import { isBy } from '~/lib/vovas-openai';

const props = defineProps<{
  message: GenieMessage<T>,
  chat: Chat<T, any, any>
}>();

const { message, chat } = props;

const buttons = useMessageButtons(props);
const toolConfig = computed<T['config']>(() => chat.config.tool.config);
const messageAssets = computed<AssetValues<T> | undefined>(() => message.assets);

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
        'msg-picked-assets': message === chat.messageWithActiveAssets
      }"
      :title="message === chat.messageWithActiveAssets ? 'This asset will be used globally for any relevant generations' : ''"
    >
      <span 
        v-html="Marked.parse(message.content)" 
        @dblclick="editMessageModal!.show()"
      />
      <div v-if="messageAssets">
        <Card 
          v-for="(content, assetId) in messageAssets" :key="assetId"
          :="{ 
            title: assetCaptions(toolConfig.assets)[assetId],
            modelValue: content,
            editOnDoubleClick: true
          }"
          @update:model-value="content => ensure(
            messageAssets, 'Message assets not defined'
          )[assetId] = content"
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
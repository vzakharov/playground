<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer">
          <img v-if="thumbnail" :src="thumbnail" class="thumbnail" />
        </a>
        <div class="flex flex-col">
          <div>
            <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer"
              v-text="title"
              class="hover:underline"
            />
            <span v-else v-text="title" />
          </div>
          <div class="subtitle" v-if="subtitle">
            {{ subtitle }}
          </div>
        </div>
      </div>
      <div class="content">
        <div
          v-html="Marked.parse(content)"
          @dblclick="editOnDoubleClick && editModal!.show()"
        />
        <div v-if="$slots.content" class="mt-3">
          <slot name="content"/>
        </div>
      </div>
      <TextModal
        v-if="editOnDoubleClick"
        ref="editModal"
        v-model="content"
        title="Edit content"
        description="You can edit the content here."
      />
      <div v-if="$slots.footer" class="footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Marked } from '@ts-stack/markdown';
  import TextModal from './TextModal.vue';
  import { refForInstance } from './utils';

  const props = defineProps<{
    title: string;
    modelValue: string; // content
    editOnDoubleClick?: boolean;
    thumbnail?: string; // New prop
    url?: string; // New prop
    subtitle?: string; // New prop
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: string];
  }>();

  const { title } = props;

  const content = useModelWrapper(props, emit);

  const editModal = refForInstance(TextModal);

  defineSlots<{
    content: void;
    footer: void;
  }>();
</script>

<style scoped lang="postcss">
  .container {
    @apply w-full mt-6 mb-3;
  }

  .card {
    @apply bg-white rounded-lg shadow-lg overflow-hidden;
  }

  .header {
    @apply flex flex-row items-center gap-3 text-lg text-gray-800 p-4 py-2 border-b border-gray-200;
  }

  .subtitle {
    @apply text-gray-400 text-sm;
  }

  .thumbnail {
    @apply w-16 h-16 rounded-full object-cover;
  }

  .content {
    @apply text-gray-700 p-4 pt-2;
  }

  .footer {
    @apply p-4 pt-2 border-t border-gray-200;
  }
</style>
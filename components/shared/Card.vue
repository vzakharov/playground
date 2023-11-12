<template>
  <div class="card-container">
    <div class="card">
      <div class="card-header">
        <img v-if="thumbnail" :src="thumbnail" class="card-thumbnail" />
        <div class="flex flex-col">
          <div>
            <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer"
              v-text="title"
              class="hover:underline"
            />
            <span v-else v-text="title" />
          </div>
          <div class="card-subtitle" v-if="subtitle">
            {{ subtitle }}
          </div>
        </div>
      </div>
      <div class="card-content" 
        v-html="Marked.parse(content)" 
        @dblclick="editOnDoubleClick && editModal!.show()"
      />
      <TextModal
        v-if="editOnDoubleClick"
        ref="editModal"
        v-model="content"
        title="Edit content"
        description="You can edit the content here."
      />
      <div v-if="$slots.footer" class="card-footer">
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
    footer: void;
  }>();
</script>

<style scoped lang="postcss">
  .card-container {
    @apply w-full mt-6 mb-3;
  }

  .card {
    @apply bg-white rounded-lg shadow-lg overflow-hidden;
  }

  .card-header {
    @apply flex flex-row items-center gap-3 text-lg text-gray-800 p-4 py-2 border-b border-gray-200;
  }

  .card-subtitle {
    @apply text-gray-400 text-sm;
  }

  .card-thumbnail {
    @apply w-16 h-16 rounded-full object-cover;
  }

  .card-content {
    @apply text-gray-700 p-4 pt-2;
  }

  .card-footer {
    @apply p-4 pt-2 border-t border-gray-200;
  }
</style>
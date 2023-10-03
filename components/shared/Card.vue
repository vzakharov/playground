<template>
  <div class="card-container">
    <div class="card">
      <div class="card-title">
        {{ title }}
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
  @apply w-full mt-6 mb-3
}

.card {
  @apply bg-white rounded-lg shadow-lg overflow-hidden;
}

.card-title {
  @apply text-lg font-medium text-gray-800 p-4 py-2 border-b border-gray-200;
}

.card-content {
  @apply text-gray-700 p-4 pt-2;
}

.card-footer {
  @apply p-4 pt-2 border-t border-gray-200;
}
</style>
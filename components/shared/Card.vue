<template>
  <div class="card-container">
    <div class="card">
      <div class="card-title">{{ title }}</div>
      <div class="card-content" v-html="Marked.parse(content)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Marked } from '@ts-stack/markdown';

  const { title, content } = defineProps<{
    title: string;
    content: string;
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
</style>
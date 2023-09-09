<template>
  <div class="container mx-auto px-4">
    <div class="flex flex-col items-center justify-center min-h-screen">
      <div class="w-full max-w-md">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <EnterName v-if="!username" @nameEntered="username = $event" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

  import { useLocalRef } from 'use-vova';
  import EnterName from '~/components/jobgenie/EnterName.vue';

  const username = useLocalRef('username', '')
  
</script>

<style scoped lang="postcss">

  .container {
    @apply flex justify-center items-center h-screen;
  }

</style>

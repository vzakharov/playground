<template>
  <div class="container">
    <div class="flex-container">
      <div class="sidebar">
        <ul class="menu">
          <li v-for="section in sections.filter(s => s.include !== false)" :key="section.id" :class="`
              menu-item
              ${section.id === selectedSection.id && 'selected'}
                        ${section.disabled && 'disabled'}
            `" @click="!section.disabled && (selectedSection = section)"
            :title="section.disabled ? section.disabled : ''">
            <span v-text="`${section.emoji} ${section.caption}`" />
          </li>
        </ul>
        <div class="status">
          <Toggle v-model="useGpt4" label="GPT-4" title="This is around 10x more expensive if turned on." />
          Total spent: ${{ Math.round(usdSpent * 100) / 100 }}
        </div>
      </div>
      <div class="content">
        <Login v-if="!data.username || !process.env.OPENAI_API_KEY" @="{ login }" />
        <template v-else>
          <Chat v-if="selectedSection.id === 'interview'" type="interview" />
          <!-- Add more sections here -->
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import Chat from '~/components/jobgenie/Chat/Chat.vue';
import { Credentials } from '~/components/jobgenie/Credentials';
import Login from '~/components/jobgenie/Login.vue';
import { data } from '~/components/jobgenie/data';
import Toggle from '~/components/shared/Toggle.vue';
import { sections, selectedSection } from './sections';
import { usdSpent, useGpt4 } from './utils';

const process = useWindowProcess();

function login(c: Credentials) {
  data.username = c.username;
  process.env.OPENAI_API_KEY = c.apiKey;
}

</script>

<style scoped lang="postcss">
.container {
  @apply mx-auto px-4 pb-20;
}

.flex-container {
  @apply flex flex-col md:flex-row items-start md:items-center justify-center min-h-screen p-5;
}

.sidebar {
  @apply w-full md:w-1/6 md:mr-6 fixed top-0 left-0 h-screen overflow-auto;
}

/* .menu {
    @apply space-y-1;
  } */

.menu-item {
  @apply cursor-pointer p-2 rounded text-gray-700 hover:text-gray-900;
  filter: grayscale(100%)
}

.menu-item.selected {
  @apply bg-gray-200;
  filter: grayscale(0%);
}

.menu-item.disabled {
  @apply opacity-50 cursor-default;
}

.menu-item:hover {
  @apply bg-gray-100;
}

.content {
  @apply w-full md:w-5/6 md:ml-64;
}

.status {
  @apply absolute bottom-0 w-full text-sm p-2 text-gray-400;
}
</style>
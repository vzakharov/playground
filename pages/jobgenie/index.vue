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

const isSidebarVisible = ref(false);

</script>

<template>
  <div class="container">
    <button class="hamburger" @click="isSidebarVisible = !isSidebarVisible">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
    <div class="sidebar" :class="{'hidden lg:block': !isSidebarVisible, 'block': isSidebarVisible}">
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
</template>


<style scoped lang="postcss">
.container {
  @apply mx-auto px-4 pb-20;
}

.flex-container {
  @apply flex flex-col md:flex-row items-start md:items-center justify-center min-h-screen p-5;
}

.sidebar {
  @apply md:w-full shadow md:w-1/6 md:mr-6 min-w-max fixed lg:top-0 top-10 left-0 h-screen overflow-auto;
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
  @apply w-full md:w-5/6;
}

.status {
  @apply absolute bottom-10 lg:bottom-0 w-full text-sm p-2 text-gray-400;
}

.hamburger {
  @apply lg:hidden absolute left-2 top-2;
}

.hamburger-line {
  @apply block w-6 h-1 bg-gray-500 my-1 rounded;
}

.sidebar {
  @apply bg-white lg:block;
}
</style>
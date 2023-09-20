<script setup lang="ts">

import { isAmong } from 'vovas-utils';
import Chat from '~/components/jobgenie/Chat/Chat.vue';
import { Credentials } from '~/components/jobgenie/Credentials';
import TextModal from '~/components/shared/TextModal.vue';
import Login from '~/components/jobgenie/Login.vue';
import { data } from '~/components/jobgenie/data';
import { exportData, importData } from '~/components/jobgenie/exportImport';
import { activeAssets, dataLastLoaded } from '~/components/jobgenie/refs';
import { sections } from '~/components/jobgenie/sections';
import { state } from '~/components/jobgenie/state';
import Button from '~/components/shared/Button.vue';
import Sidebar from '~/components/shared/Sidebar.vue';
import Toggle from '~/components/shared/Toggle.vue';
import { isVisible as sidebarIsVisible } from '~/components/shared/refs';
import { chatTypes } from '~/lib/jobgenie';

const process = useWindowProcess();
const { usdSpent, useGpt4, selectedSectionId } = toRefs(state);

function login(c: Credentials) {
  data.username = c.username;
  process.env.OPENAI_API_KEY = c.apiKey;
}

const importModal = ref({ isVisible: false, text: '' });

</script>

<template>
  <div class="container">
    <Sidebar>
      <template #upper>
        <ul>
          <li v-for="section in sections" :key="section.id" 
            :class="`
              menu-item
              ${section.id === selectedSectionId && 'selected'}
              ${section.disabled && 'disabled'}
            `"
            @click="!section.disabled && ( selectedSectionId = section.id ) && ( sidebarIsVisible = false )"
            :title="section.disabled ? 'Please complete the previous sections first.' : ''"
          >
            <span v-text="`${section.emoji} ${section.caption}`" />
          </li>
        </ul>
      </template>
      <template #lower>
      <!-- Export data -->
        <Button rounded small outline gray
          class="mb-2"
          caption="⤓ Export data"
          @click="exportData"
        />
        <!-- Import data -->
        <Button rounded small outline gray
          caption="⤒ Import data"
          @click="importModal = { isVisible: true, text: JSON.stringify(data, null, 2) }"
        />
        <Toggle 
          v-model="useGpt4" 
          :label="useGpt4 ? 'GPT-4' : 'GPT-3.5'"
          title="This is around 10x more expensive if turned on." 
        />
        Total spent: ${{ Math.round(usdSpent * 100) / 100 }}
      </template>
    </Sidebar>
    <div class="content">
      <Login v-if="!data.username || !process.env.OPENAI_API_KEY" @="{ login }" />
      <template v-else>
        <Chat
          v-if="isAmong(chatTypes)(selectedSectionId)"
          :key="`${selectedSectionId}-${dataLastLoaded}`"
          :type="selectedSectionId"
        />
        <!-- Add more sections here -->
      </template>
    </div>
    <TextModal
      v-model="importModal"
      title="Import data"
      description="Below is the JSON code for your existing data. Edit or replace it and click Import to update your data."
      buttonText="Import"
      monospace
      @submit="importData"
    />
  </div>
</template>


<style scoped lang="postcss">
.container {
  @apply mx-auto px-4 pb-20 lg:pl-64;
}

.flex-container {
  @apply flex flex-col md:flex-row items-start md:items-center justify-center min-h-screen p-5;
}

.sidebar {
  @apply md:w-full shadow md:w-1/6 md:mr-6 min-w-max fixed lg:top-0 top-10 left-0 h-screen overflow-auto;
}

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
  @apply w-full md:w-5/6 mt-10;
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
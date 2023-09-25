<script lang="ts">

import { isAmong } from 'vovas-utils';
import Chat from '~/components/jobgenie/Chat/Chat.vue';
import { Credentials } from '~/components/jobgenie/Credentials';
import Login from '~/components/jobgenie/Login.vue';
import { data } from '~/components/jobgenie/data';
import { exportData, importData, stringifyData, stringifiedData } from '~/components/jobgenie/exportImport';
import { dataLastLoaded } from '~/components/jobgenie/refs';
import { sections } from '~/components/jobgenie/sections';
import { globalState } from '~/components/jobgenie/state';
import Button from '~/components/shared/Button.vue';
import Sidebar from '~/components/shared/Sidebar.vue';
import TextModal from '~/components/shared/TextModal.vue';
import Toggle from '~/components/shared/Toggle.vue';
import { refForInstance } from '~/components/shared/utils';
import { ChatType, chatTypes, defaultData } from '~/lib/jobgenie';

export default {

  components: { Chat, Login, Button, Sidebar, TextModal, Toggle },

  setup() {

    const process = useWindowProcess();
    const { usdSpent, useGpt4, selectedSectionId } = toRefs(globalState);

    function login(c: Credentials) {
      data.username = c.username;
      process.env.OPENAI_API_KEY = c.apiKey;
    }

    const importModal = refForInstance(TextModal);

    const sidebar = refForInstance(Sidebar<ChatType>);

    return {
      chatTypes, data, dataLastLoaded, defaultData, exportData, importModal, importData, isAmong, login, process, 
      sections, stringifyData, stringifiedData, usdSpent, useGpt4, selectedSectionId, sidebar, globalState
    }
  }
}

</script>

<template>
  <div class="container">
    <Sidebar ref="sidebar"
      :menu="{
        items: sections,
        selectedId: selectedSectionId,
        onSelect: id => selectedSectionId = id,
      }"
    >
      <template #lower>
        <Button rounded small outline
          caption="Edit as YAML"
          @click="importModal!.show()"
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
    <TextModal monospace
      ref="importModal"
      v-model="stringifiedData"
      title="Import data"
      description="Here is the YAML for your existing data — useful for making small changes, backing up, or sharing with others."
      confirmButtonText="Update"
      :extraButtons="[
        { caption: '⤓ Download', outline: true, onClick: exportData },
        { caption: 'Reset', outline: true, danger: true,
          onClick: () => importModal!.text = stringifyData(defaultData)
        }
      ]"
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
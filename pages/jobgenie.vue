<script setup lang="ts">

import Chat from '~/components/jobgenie/Chat/Chat.vue';
import { Credentials } from '~/components/jobgenie/Credentials';
import Login from '~/components/jobgenie/Login.vue';
import { data } from '~/components/jobgenie/data';
import { exportData, stringifiedData, stringifyData } from '~/components/jobgenie/exportImport';
import { useProfiles } from '~/components/jobgenie/profiles';
import { dataLastLoaded } from '~/components/jobgenie/refs';
import { getChatType, sections } from '~/components/jobgenie/sections';
import { globalState, initSelectedSectionId } from '~/components/jobgenie/state';
import Button from '~/components/shared/Button.vue';
import Dropdown from '~/components/shared/Dropdown.vue';
import Sidebar from '~/components/shared/Sidebar.vue';
import TextModal from '~/components/shared/TextModal.vue';
import Toggle from '~/components/shared/Toggle.vue';
import { refForInstance } from '~/components/shared/utils';
import { useHashRoute } from '~/composables/useHashRoute';
import { ChatType, defaultData, temperatureDescriptors } from '~/lib/jobgenie';

const { usdSpent, useGpt4, selectedSectionId, temperatureDescriptor, openaiKey } = toRefs(globalState);

useHashRoute(selectedSectionId, initSelectedSectionId);

function login(c: Credentials) {
  data.username = c.username;
  openaiKey.value = c.apiKey;
}

const importModal = refForInstance(TextModal);
const sidebar = refForInstance(Sidebar<ChatType>);

const win = window;
// A hack to use window methods in template

const profiles = useProfiles();
const { slugs: profileSlugs, newProfile, loadProfile } = profiles;

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
        <Dropdown v-if="profileSlugs.length" label="Profiles" :options="profileSlugs"
          :modelValue="data.profileSlug || 'Untitled profile'"
          @update:modelValue="loadProfile($event)"
        />
        <Button rounded small outline
          caption="New profile"
          @click="newProfile(win.prompt('Enter a name for your new profile (optional):'))"
        />
        <Button rounded small outline
          caption="Edit as YAML"
          @click="importModal!.show()"
        />
        <Dropdown label="Temperature" :options="temperatureDescriptors" v-model="temperatureDescriptor" />
        <Toggle 
          v-model="useGpt4" 
          :label="useGpt4 ? 'GPT-4' : 'GPT-3.5'"
          title="This is around 10x more expensive if turned on." 
        />
        <div
          title="Just an estimate — make sure to double-check your OpenAI billing page; double-click to reset."
          @dblclick="win.confirm('Are you sure you want to reset your spending?') && (usdSpent = 0)"
        >
          Total spent: ${{ Math.round(usdSpent * 100) / 100 }}
        </div>
      </template>
    </Sidebar>
    <div class="content">
      <Login v-if="!data.username || !openaiKey" @="{ login }" />
      <template v-else>
        <Chat
          :key="`${selectedSectionId}-${dataLastLoaded}`"
          :type="getChatType(selectedSectionId)"
        />
        <!-- Add more sections here -->
      </template>
    </div>
    <TextModal monospace
      ref="importModal"
      v-model="stringifiedData"
      title="Import data"
      description="Here is the YAML for your existing data — useful for making small changes, backing up, or sharing with others."
      updateButtonText="Update"
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
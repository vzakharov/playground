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
import ButtonGroup from '~/components/shared/ButtonGroup.vue';
import Dropdown from '~/components/shared/Dropdown.vue';
import Sidebarred from '~/components/shared/Sidebarred.vue';
import TextModal from '~/components/shared/TextModal.vue';
import Toggle from '~/components/shared/Toggle.vue';
import { refForInstance } from '~/components/shared/utils';
import { useHashRoute } from '~/composables/useHashRoute';
import { ChatType, allTrue, defaultData, temperatureDescriptors } from '~/lib/jobgenie';

const { usdSpent, useGpt4, selectedSectionId, temperatureDescriptor, openaiKey } = toRefs(globalState);

useHashRoute(selectedSectionId, initSelectedSectionId);
const refs = { selectedSectionId };

function login(c: Credentials) {
  data.username = c.username;
  openaiKey.value = c.apiKey;
}

const importModal = refForInstance(TextModal);

const win = window;
// A hack to use window methods in template

const profiles = useProfiles();
const { slugs: profileSlugs, newProfile, loadProfile, deleteCurrentProfile } = profiles;

</script>

<template>
  <Sidebarred
    :sidebar-menu="{
      items: sections,
      selectionRef: refs.selectedSectionId
    }"
  >
    <template #sidebar-lower>
      <template v-if="profileSlugs.length > 1">
        <Dropdown label="Profiles" :options="profileSlugs"
          :modelValue="data.profileSlug || 'Untitled profile'"
          @update:modelValue="loadProfile($event)"
        />
      </template>
      <ButtonGroup :defaultProps="allTrue('rounded', 'small', 'outline')"
        :buttons="[
          {
            caption: 'New',
            onClick: () => newProfile(win.prompt('Enter a name for your new profile (optional):'))
          },
          {
            caption: 'Edit',
            onClick: () => importModal!.show()
          },
          profileSlugs.length > 1 && {
            caption: 'Delete',
            onClick: () => win.confirm('Are you sure you want to delete this profile?') && deleteCurrentProfile()
          },
        ]"
      />
      <Dropdown label="Temperature" 
        :options="temperatureDescriptors"
        v-model="temperatureDescriptor" 
        cycle-on-click
      />
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
    <Login v-if="!data.username || !openaiKey" @="{ login }" />
    <template v-else>
      <Chat
        :key="`${selectedSectionId}-${dataLastLoaded}`"
        :type="getChatType(selectedSectionId)"
      />
      <!-- Add more sections here -->
    </template>
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
  </Sidebarred>
</template>
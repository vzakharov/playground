<script setup lang="ts">

import Chat from '~/components/jobgenie/Chat/Chat.vue';
import { Credentials } from '~/components/jobgenie/Credentials';
import Login from '~/components/jobgenie/Login.vue';
import { exportData, stringifiedData, stringifyData } from '~/components/jobgenie/exportImport';
import { useProfiles } from '~/components/jobgenie/profiles';
import { sections } from '~/components/jobgenie/sections';
import ButtonGroup from '~/components/shared/ButtonGroup.vue';
import Dropdown from '~/components/shared/Dropdown.vue';
import Sidebarred from '~/components/shared/Sidebarred.vue';
import TextModal from '~/components/shared/TextModal.vue';
import { refForInstance } from '~/components/shared/utils';
import { useHashRoute } from '~/composables/useHashRoute';
import { defaultData } from '~/lib/jobgenie';
import { allTrue } from '~/lib/utils';
import { globalData, globalState, initSelectedToolId, genie } from '~/lib/genie-vue';

const { selectedToolId, openaiKey } = toRefs(globalState);

useHashRoute(selectedToolId, initSelectedToolId);

function login(c: Credentials) {
  globalData.username = c.username;
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
    }"
    v-model:sidebarMenuItemId="selectedToolId"
  >
    <template #sidebar-lower>
      <template v-if="profileSlugs.length > 1">
        <Dropdown label="Profiles" :options="profileSlugs"
          :modelValue="globalData.profileSlug || 'Untitled profile'"
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
      <GenieSettings appId="jobgenie" :="{ genie }"/>
    </template>
    <Login v-if="!globalData.username || !openaiKey" @="{ login }" />
    <template v-else>
      <Chat
        :key="`${selectedToolId}-${globalState.dataLastLoaded}`"
        :="{ tool: genie.bound[selectedToolId] }"
      />
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
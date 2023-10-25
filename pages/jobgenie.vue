<script setup lang="ts">

import Chat from '~/components/genie/Chat.vue';
import Login from '~/components/genie/Login.vue';
import ButtonGroup from '~/components/shared/ButtonGroup.vue';
import Dropdown from '~/components/shared/Dropdown.vue';
import Sidebarred from '~/components/shared/Sidebarred.vue';
import TextModal from '~/components/shared/TextModal.vue';
import Settings from '~/components/genie/Settings.vue';
import { refForInstance } from '~/components/shared/utils';
import { useHashRoute } from '~/composables/useHashRoute';
import { Credentials, DataInputOutput } from '~/lib/genie-vue';
import { jobGenie as genie, sections } from '~/lib/jobgenie-vue';
import { allTrue, bound } from '~/lib/utils';

const { 
  config: {globalData, globalState },
  initSelectedToolId,
  profile
} = genie;

const io = bound(genie.io);

const { selectedToolId, openaiKey } = toRefs(globalState);

useHashRoute(selectedToolId, initSelectedToolId);

function login(c: Credentials) {
  globalData.username = c.username;
  openaiKey.value = c.apiKey;
}

const importModal = refForInstance(TextModal);

const win = window;
// A hack to use window methods in template

</script>

<template>
  <Sidebarred
    :sidebar-menu="{
      items: sections,
    }"
    v-model:sidebarMenuItemId="selectedToolId"
  >
    <template #sidebar-lower>
      <template v-if="profile.slugs.length > 1">
        <Dropdown label="Profiles" :options="profile.slugs"
          :modelValue="globalData.profileSlug || 'Untitled profile'"
          @update:modelValue="profile.load($event)"
        />
      </template>
      <ButtonGroup :defaultProps="allTrue('rounded', 'small', 'outline')"
        :buttons="[
          {
            caption: 'New',
            onClick: () => profile.new(win.prompt('Enter a name for your new profile (optional):'))
          },
          {
            caption: 'Edit',
            onClick: () => importModal!.show()
          },
          profile.slugs.length > 1 && {
            caption: 'Delete',
            onClick: () => win.confirm('Are you sure you want to delete this profile?') && profile.delete()
          },
        ]"
      />
      <Settings appId="jobgenie" :="{ genie }"/>
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
      v-model="io.stringifiedData"
      title="Import data"
      description="Here is the YAML for your existing data — useful for making small changes, backing up, or sharing with others."
      updateButtonText="Update"
      :extraButtons="[
        { caption: '⤓ Download', outline: true, onClick: io.download },
        { caption: 'Reset', outline: true, danger: true,
          onClick: () => importModal!.text = DataInputOutput.stringify(genie.defaultData)
        }
      ]"
    />
  </Sidebarred>
</template>
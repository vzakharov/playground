<script setup lang="ts">

import { VueGenie } from '~/lib/genie-vue';
import { $throw } from 'vovas-utils';
import Dropdown from '~/components/shared/Dropdown.vue';
import Toggle from '~/components/shared/Toggle.vue';
import { Genie, Toolset, temperatureDescriptors } from '~/lib/genie';

const { genie  } = defineProps<{
  genie: VueGenie<Toolset>;
}>();

const win = window;

const { usdSpent, useGpt4, temperatureDescriptor, openaiKey } = toRefs(genie.config.globalState);

function editApiKey() {
  openaiKey.value = prompt('Enter your OpenAI API key:') ?? $throw('No API key entered');
}

</script>

<template>
  <Dropdown label="Temperature" 
    :options="temperatureDescriptors"
    v-model="temperatureDescriptor" 
    cycle-on-click
  />
  <Toggle
    v-model="useGpt4" 
    :label="{ on: 'GPT-4', off: 'GPT-3.5' }"
    title="This is around 10x more expensive if turned on." 
  />
  <div
    title="Just an estimate — make sure to double-check your OpenAI billing page; double-click to reset."
    @dblclick="win.confirm('Are you sure you want to reset your spending?') && (usdSpent = 0)"
  >
    Total spent: ${{ Math.round(usdSpent * 100) / 100 }}
  </div>
  <span
    v-text="openaiKey ? openaiKey.slice(0, 7) + '...' : 'Click to set API key'"
    @click="editApiKey"
    :class="{
      'cursor-pointer': true,
      'text-red-500': !openaiKey,
    }"
  />
</template>
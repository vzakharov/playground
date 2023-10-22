<script setup lang="ts" generic="G extends Genie<Toolset>">

import { $throw } from 'vovas-utils';
import Dropdown from '~/components/shared/Dropdown.vue';
import Toggle from '~/components/shared/Toggle.vue';
import { Genie, Toolset, temperatureDescriptors } from '~/lib/genie';

const { genie: { defaultState }, appId  } = defineProps<{
  appId: string;
  genie: G;
}>();

const win = window;

const state = useLocalReactive(appId+'-genie-state', defaultState);

const { usdSpent, useGpt4, temperatureDescriptor, openaiKey } = toRefs(state);

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
    :label="useGpt4 ? 'GPT-4' : 'GPT-3.5'"
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
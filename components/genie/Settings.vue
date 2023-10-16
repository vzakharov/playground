<script setup lang="ts">

import { GenieState, TemperatureDescriptor, defaultGenieState, temperatureDescriptors } from '~/lib/genie';
import Dropdown from '~/components/shared/Dropdown.vue';
import Toggle from '~/components/shared/Toggle.vue';
import { $throw } from 'vovas-utils';

const props = defineProps<{
  appId: string;
}>();

const emit = defineEmits<{
  'update': [value: GenieState]
}>();

const win = window;

const state = useLocalReactive(props.appId+'-genie-state', defaultGenieState);

watch(state, () => emit('update', state), { immediate: true });

const { usdSpent, useGpt4, temperatureDescriptor, apiKey } = toRefs(state);

function editApiKey() {
  apiKey.value = prompt('Enter your OpenAI API key:') ?? $throw('No API key entered');
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
    v-text="apiKey ? apiKey.slice(0, 7) + '...' : 'Click to set API key'"
    @click="editApiKey"
    :class="{
      'cursor-pointer': true,
      'text-red-500': !apiKey,
    }"
  />
</template>
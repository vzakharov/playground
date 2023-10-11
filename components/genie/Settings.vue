<script setup lang="ts">

import { temperatureDescriptors } from '~/lib/genie';
import Dropdown from '~/components/shared/Dropdown.vue';
import Toggle from '~/components/shared/Toggle.vue';

const props = defineProps<{
  appId: string;
}>()

const win = window;

const { usdSpent, useGpt4, temperatureDescriptor } = toRefs(
  useLocalReactive(props.appId+'-state', {
    usdSpent: 0,
    useGpt4: false,
    temperatureDescriptor: temperatureDescriptors[0],
  })
);

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
</template>
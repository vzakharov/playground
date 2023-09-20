<script setup lang="ts">

import { ButtonProps, ButtonPropsForGroup } from './buttonStuff';
import Button from './Button.vue';

const props = defineProps<{
  buttons: ButtonPropsForGroup[]
}>();

</script>

<template>
  <div class="flex space-x-1.5">
    <Button 
      v-for="button in props.buttons" 
      :key="button.caption" 
      :="button"
    />
  </div>
</template>
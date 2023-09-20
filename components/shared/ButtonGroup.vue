<script setup lang="ts">

import { ButtonProps } from './buttonStuff';
import Button from './Button.vue';

debugger
const props = defineProps<{
  buttons: ButtonProps[]
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
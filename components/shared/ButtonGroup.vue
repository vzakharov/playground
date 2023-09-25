<script setup lang="ts">

import _ from 'lodash';
import { ButtonProps, ButtonPropsForGroup } from './buttonStuff';
import Button from './Button.vue';

const props = defineProps<{
  defaultProps?: Partial<ButtonProps>,
  buttons: ButtonPropsForGroup[]
}>();

</script>

<template>
  <div class="flex space-x-1.5">
    <Button 
      v-for="button in buttons" 
      :key="button.caption" 
      :="{
        ...defaultProps,
        ...button
      }"
    />
  </div>
</template>
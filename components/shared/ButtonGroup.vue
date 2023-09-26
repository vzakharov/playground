<script setup lang="ts">

import _ from 'lodash';
import { ButtonProps, ButtonPropsForGroup } from './buttonStuff';
import Button from './Button.vue';
import { Falsible } from '~/lib/jobgenie';

const props = defineProps<{
  defaultProps?: Partial<ButtonProps>,
  buttons: Falsible<ButtonPropsForGroup>[]
}>();

</script>

<template>
  <div class="flex space-x-1.5">
    <Button 
      v-for="button in _.compact(buttons)"
      :key="button.caption" 
      :="{
        ...defaultProps,
        ...button
      }"
    />
  </div>
</template>
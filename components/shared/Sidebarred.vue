<script setup lang="ts" generic="SidebarMenuItemId extends string = string">

import { SidebarMenu } from './SidebarStuff';
import Sidebar from './Sidebar.vue'

const props = defineProps<{
  sidebarMenu?: SidebarMenu<SidebarMenuItemId>,
  sidebarMenuItemId?: SidebarMenuItemId,
}>();

const emit = defineEmits<{
  'update:sidebarMenuItemId': [value: SidebarMenuItemId],
}>();

const sidebarMenuItemId = useModelWrapper(props, emit, 'sidebarMenuItemId');

</script>

<template>
  <div class="container">
    <Sidebar ref="sidebar"
      :menu="sidebarMenu"
      v-model:menuItemId="sidebarMenuItemId"
    >
      <template #upper>
        <slot name="sidebar-upper"/>
      </template>
      <template #lower>
        <slot name="sidebar-lower"/>
      </template>
    </Sidebar>
    <div class="content">
      <slot/>
    </div>
  </div>
</template>

<style scoped lang="postcss">

.container {
  @apply mx-auto px-4 pb-20 lg:pl-64;
}

.content {
  @apply w-full md:w-5/6 mt-10;
}

</style>
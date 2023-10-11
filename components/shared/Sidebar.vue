<script setup lang="ts" generic="MenuItemId extends string = string">

import { SidebarMenu } from './SidebarStuff';

defineProps<{
  menu?: SidebarMenu<MenuItemId>
}>();

const isVisible = ref(false);

</script>

<template>
  <button class="hamburger" @click="isVisible = !isVisible">
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  </button>
  <div class="sidebar" :class="{ 'hidden lg:block': !isVisible, 'block': isVisible }">
    <div class="upper">
      <ul v-if="menu">
        <li v-for="item in menu.items" :key="item.id" 
          :class="{
            'menu-item': true,
            selected: item.id === menu.selectedId,
            disabled: item.disabled
          }"
          :title="item.disabled ? item.disabledTooltip : ''"
          @click="!item.disabled && ( menu.onSelect(item.id), isVisible = false )"
        >
          <span v-if="item.emoji" v-text="item.emoji"/>
          <span v-text="item.caption ?? item.id"/>
        </li>
      </ul>
      <slot name="upper"/>
    </div>
    <div class="lower">
      <slot name="lower"/>
    </div>
  </div>
</template>

<style scoped lang="postcss">

.hamburger {
  @apply lg:hidden fixed left-2 top-2 bg-white p-1;
}

.hamburger-line {
  @apply block w-6 h-1 bg-gray-500 my-1 rounded;
}

.sidebar {
  @apply shadow rounded md:mr-6 min-w-max fixed lg:top-0 top-10 left-0 h-screen overflow-auto bg-white lg:block p-2;
  width: 12rem;
}

.upper {
  @apply flex flex-col gap-y-2.5;
}

.lower {
  @apply absolute flex flex-col gap-y-2.5 bottom-10 lg:bottom-0 w-11/12 self-center text-sm p-2 text-gray-400;
}

.menu-item {
  @apply cursor-pointer p-2 rounded text-gray-700 hover:text-gray-900;
  filter: grayscale(100%)
}

.menu-item.selected {
  @apply bg-gray-200;
  filter: grayscale(0%);
}

.menu-item.disabled {
  @apply opacity-50 cursor-default;
}

.menu-item:hover {
  @apply bg-gray-100;
}

</style>

<template>
  <button class="hamburger" @click="isVisible = !isVisible">
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  </button>
  <div class="sidebar" :class="{ 'hidden lg:block': !isVisible, 'block': isVisible }">
    <div class="upper">
      <slot name="upper"/>
    </div>
    <div class="lower">
      <slot name="lower"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import { isSidebarVisible as isVisible} from './refs';

</script>

<style scoped lang="postcss">

.hamburger {
  @apply lg:hidden fixed left-2 top-2 bg-white p-1 shadow rounded;
}

.hamburger-line {
  @apply block w-6 h-1 bg-gray-500 my-1 rounded;
}

.sidebar {
  @apply shadow rounded md:mr-6 min-w-max fixed lg:top-0 top-10 left-0 h-screen overflow-auto bg-white lg:block p-2;
  width: 12rem;
}

.lower {
  @apply absolute bottom-10 lg:bottom-0 w-full text-sm p-2 text-gray-400;
}

</style>

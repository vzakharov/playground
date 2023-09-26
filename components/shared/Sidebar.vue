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
          @click="!item.disabled && ( menu.onSelect(item.id), isVisible = false )"
        >
          <span v-text="`${item.emoji} ${item.caption}`" />
        </li>
      </ul>
      <slot name="upper"/>
    </div>
    <div class="lower">
      <slot name="lower"/>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Id extends string = string">

defineProps<{
  menu?: {
    items: { id: Id, emoji: string, caption: string, disabled?: boolean }[],
    selectedId: Id,
    onSelect: (id: Id) => void
  }
}>();


const isVisible = ref(false);

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

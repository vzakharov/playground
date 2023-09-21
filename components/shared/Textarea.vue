<script lang="ts" src="./TextareaScript.ts"/>

<template>
  <textarea class="textarea"
    ref="textarea"
    v-model="input"
    :style="mapValues({ minHeight, maxHeight, height }, v => `${v}px`)"
    :="{ placeholder }"
    @keydown.enter.exact.prevent="handleKeydown('enter')"
    @keydown.shift.enter.prevent="handleKeydown('shift+enter')"
  />
</template>


<style scoped lang="postcss">
.textarea {
  @apply bg-white border border-gray-300 rounded-md py-2 px-4 block w-full appearance-none leading-normal;
  overflow: auto;
  resize: none;
}
</style>
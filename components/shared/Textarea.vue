<script lang="ts" src="./TextareaScript.ts"/>

<template>
  <div class="container">
    <label v-if="label" class="label" :for="id" v-text="label" />
    <textarea class="textarea"
      ref="textarea"
      v-model="input"
      :style="mapValues({ minHeight, maxHeight, height }, v => `${v}px`)"
      :="{ id, placeholder }"
      @keydown.enter.exact.prevent="handleKeydown('enter')"
      @keydown.shift.enter.prevent="handleKeydown('shift+enter')"
    />
  </div>
</template>


<style scoped lang="postcss">
.container {
  @apply flex flex-col;
}

.label {
  @apply text-gray-400 text-sm mb-2;
}

.textarea {
  @apply bg-white border rounded-md py-2 px-4 block w-full appearance-none leading-normal;
  overflow: auto;
  resize: none;
}
</style>
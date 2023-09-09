<template>
  <div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Hi there! What’s your name?
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Your name" v-model="username">
      <p class="text-gray-600 pt-3 text-xs italic">We’ll use your name to create your personalized description to help you craft your dream job.</p>
    </div>
    <div class="flex items-center justify-between">
      <button
        :disabled="!username"
        :class="{ 'primary-btn': username, 'disabled-btn': !username }" 
        type="button" 
        @click="startChat"
      >
        Start Crafting
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

  const username = ref('')

  const emit = defineEmits(['nameEntered'])

  const startChat = () => {
    if (username.value) {
      emit('nameEntered', username.value)
    }
  }

</script>

<style scoped lang="postcss">

  .primary-btn {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }

  .disabled-btn {
    @apply bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed;
  }

</style>
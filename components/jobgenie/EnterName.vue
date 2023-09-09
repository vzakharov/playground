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
      <Button :disabled="!username" @click="startChat" caption="Start Crafting" />
    </div>
  </div>
</template>

<script setup lang="ts">
  
  import Button from '~/components/shared/Button.vue'

  const username = ref('')

  const emit = defineEmits(['nameEntered'])

  const startChat = () => {
    if (username.value) {
      emit('nameEntered', username.value)
    }
  }
  
</script>
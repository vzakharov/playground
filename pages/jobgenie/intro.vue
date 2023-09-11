<template>
  <div class="container mx-auto px-4">
    <div class="flex flex-col items-center justify-center min-h-screen p-5">
      <div class="w-full max-w-3xl">
        <Login v-if="!username || !process.env.OPENAI_API_KEY" @="{ login }" />
        <Chat v-else type="interview" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { Credentials } from '~/components/jobgenie/Credentials';
import { username } from '~/components/jobgenie/username';
import Chat from '~/components/jobgenie/Chat.vue';
import Login from '~/components/jobgenie/Login.vue';

  const process = useWindowProcess();

  function login(c: Credentials) {
    username.value = c.username;
    process.env.OPENAI_API_KEY = c.apiKey;
  }

</script>
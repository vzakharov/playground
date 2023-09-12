<template>
  <div class="container mx-auto px-4 pb-20">
    <div class="flex flex-col items-center justify-center min-h-screen p-5">
      <div class="w-full max-w-3xl">
        <Login v-if="!data.username || !process.env.OPENAI_API_KEY" @="{ login }" />
        <Chat v-else type="interview" />
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { Credentials } from '~/components/jobgenie/Credentials';
import { appData as data } from '~/components/jobgenie/data';
import Chat from '~/components/jobgenie/Chat/Chat.vue';
import Login from '~/components/jobgenie/Login.vue';

  const process = useWindowProcess();

  function login(c: Credentials) {
    data.username = c.username;
    process.env.OPENAI_API_KEY = c.apiKey;
  }

</script>
<template>
  <div class="container mx-auto px-4 pb-20">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-center min-h-screen p-5">
      <div class="w-full p-2 md:w-1/4 md:mr-6 fixed top-0 left-0 h-screen overflow-auto">
        <ul class="space-y-2">
          <li v-for="section in sections" :key="section" class="cursor-pointer hover:bg-gray-200 p-2 rounded">
            {{ section }}
          </li>
        </ul>
      </div>
      <div class="w-full md:w-3/4 md:ml-64">
        <Login v-if="!data.username || !process.env.OPENAI_API_KEY" @="{ login }" />
        <Chat v-else type="interview" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { Credentials } from '~/components/jobgenie/Credentials';
import { data } from '~/components/jobgenie/data';
import Chat from '~/components/jobgenie/Chat/Chat.vue';
import Login from '~/components/jobgenie/Login.vue';

const process = useWindowProcess();

function login(c: Credentials) {
  data.username = c.username;
  process.env.OPENAI_API_KEY = c.apiKey;
}

// Add your sections here
const sections = ['Interview'];

</script>
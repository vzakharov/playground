<template>
  <div class="container mx-auto px-4 pb-20">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-center min-h-screen p-5">
      <div class="w-full p-2 md:w-1/6 md:mr-6 fixed top-0 left-0 h-screen overflow-auto">
        <ul class="space-y-2">
          <li v-for="section in sections.filter(s => s.include !== false)"
            :key="section.id" class="cursor-pointer hover:bg-gray-200 p-2 rounded"   
            @click="selectedSection = section"
          >
            <span v-text="section.caption" />
          </li>
        </ul>
      </div>
      <div class="w-full md:w-5/6 md:ml-64">
        <Login v-if="!data.username || !process.env.OPENAI_API_KEY" @="{ login }" />
        <template v-else>
          <Chat v-if="selectedSection.id === 'interview'" type="interview" />
          <!-- Add more sections here -->
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

  import Chat from '~/components/jobgenie/Chat/Chat.vue';
  import { Credentials } from '~/components/jobgenie/Credentials';
  import Login from '~/components/jobgenie/Login.vue';
  import { data } from '~/components/jobgenie/data';
  import { sections, selectedSection } from './sections';

  const process = useWindowProcess();

  function login(c: Credentials) {
    data.username = c.username;
    process.env.OPENAI_API_KEY = c.apiKey;
  }

</script>
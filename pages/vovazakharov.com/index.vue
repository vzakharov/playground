<script setup lang="ts">

import Toggle from '~/components/shared/Toggle.vue';
import Card from '~/components/shared/Card.vue';
import { badWord, projects } from '~/lib/vovazakharov.com';

const showTechDetails = ref(false);

</script>


<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Welcome to Vova’s World!</h1>
      <p class="mt-2 mb-4">Coding, writing, AI, and out-of-the-box insights.</p>
    </header>
    <main class="main-content">
      <section class="about-section">
        <h2>About Me</h2>
        <p>I'm Vova, a tech enthusiast with a passion for AI, coding, and tech copywriting.</p>
      </section>
      <section class="projects-section">
        <h2>Projects</h2>
        <Toggle v-model="showTechDetails" label="Show tech details" />
        <!-- <h3>GPTs</h3>
        <p>Here are the custom GPTs I’ve made so far for ChatGPT:</p>
        <Card v-for="gpt in gpts" :key="gpt.name"
          :title="gpt.name"
          :modelValue="gpt.description"
        /> -->
        <template v-for="projectGroup in projects">
          <h3>{{ projectGroup.name }}</h3>
          <p>{{ projectGroup.description }}</p>
          <Card v-for="project in projectGroup.projects" :key="project.name"
            :title="project.name"
            :subtitle="project.tagline"
            :modelValue="project.description"
            :="project"
          >
            <template #content v-if="showTechDetails && project.techDetails">
              <strong>Tech details: </strong>{{ project.techDetails }}
            </template>
          </Card>
        </template>
      </section>
    </main>
    <footer class="app-footer">
      <p>© 2023 Vova “words are a {{ badWord }}” Zakharov</p>
    </footer>
  </div>
</template>

<style lang="postcss">
.app-container {
  @apply flex flex-col min-h-screen;
}

.app-header {
  @apply bg-blue-500 text-white text-center pt-6;
}

.app-header h1 {
  @apply text-4xl font-bold;
}

.app-header p {
  @apply text-xl;
}

.main-content {
  @apply flex-grow container mx-auto p-4;
}

.about-section, .projects-section {
  @apply my-4 p-4 bg-gray-100 rounded-lg shadow-md;
}

h2 {
  @apply text-2xl font-semibold mb-3;
}

h3 {
  @apply text-xl font-semibold mb-3;
}

.app-footer {
  @apply bg-gray-800 text-white text-center p-4;
}
</style>

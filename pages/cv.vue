<script setup lang="ts">

type Section = { title: string, text?: string, subsections?: Section[] };

const cv = ref({
  header: {
    title: 'Vova Zakharov',
    subtitle: 'AI Tinkerer • Coding Fanatic • Word Alchemist',
  },
  sections: [
    {
      title: 'Bio',
      text: 'Hey there! I\'ve been messing around with tech, AI, and words for over 20 years. Sometimes, I mix them all up and see what comes out. I find joy in creating projects that stir curiosity, challenge norms, and ultimately, make a difference.',
    },
    {
      title: 'Experience',
      subsections: [
        {
          title: 'Voicemod (Experience and Innovation team), January-September 2023',
          text: 'Developed prototypes for Voicemod\'s experimental ideas. Built a Discord bot - the bot-making process was as simple as writing in YAML. Cobbled together a Python-based web API resembling chatgpt\'s web interface, but operating with a local python model for generation.',
        },
        {
          title: 'Personal projects (Since 2020)',
          text: '',
          subsections: [
            {
              title: 'Jukebox Web UI',
              text: 'Created a web UI built on top of Gradio and runs on Google Colab. An innovative approach using Google Colab as an actual server.',
            },
            {
              title: '“almostmagic” package',
              text: 'Simplified the integration of LLMs into projects. Just one line of code and it feels almost like magic.',
            },
            {
              title: 'JobGenie - An AI-powered job creation tool',
              text: 'A revolutionary AI tool that doesn\'t just assist in job searches but invents unique job roles. Welcome to JobGenie.',
            },
          ],
        },
        {
          title: '2006-2023: Copywriter & Diverse Roles in Marketing, Sales, and Tech Support',
          text: 'Throughout these roles, I consistently leveraged self-developed software tools to enhance and automate various aspects of my work, highlighting my passion for blending technology with traditional job functions.',
        },
      ],
    },
    {
      title: 'Education',
      subsections: [
        {
          title: 'Moscow Institute of Physics and Technology',
          text: 'Master, Engineering Physics/Applied Physics (2000 - 2006)',
        },
      ],
    },
  ],
});

</script>

<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="title" v-text="cv.header.title"></h1>
        <p class="subtitle" v-text="cv.header.subtitle"></p>
      </div>
    </div>

    <!-- Sections -->
    <div class="section" v-for="(section, index) in cv.sections" :key="index">
      <h2 class="section-title" v-text="section.title"></h2>
        <p class="section-text" v-if="section.text" v-text="section.text"></p>
        <div class="subsection" v-if="section.subsections" v-for="(sub, subIndex) in section.subsections" :key="`sub-${subIndex}`">
          <h3 class="subsection-title" v-text="sub.title"></h3>
          <p class="section-text" v-if="sub.text" v-text="sub.text"></p>
          <div class="subsubsection" v-if="sub.subsections" v-for="(subsub, subsubIndex) in sub.subsections" :key="`subsub-${subsubIndex}`">
            <h4 class="subsubsection-title" v-text="subsub.title"></h4>
            <p class="section-text" v-if="subsub.text" v-text="subsub.text"></p>
          </div>
        </div>
      </div>
  </div>
</template>

<style lang="postcss">
.container {
  @apply flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800;
}

.header {
  @apply my-10;
}

.title {
  @apply text-4xl font-bold mb-2;
}

.subtitle {
  @apply text-xl text-gray-600;
}

.section {
  @apply my-8 w-full max-w-2xl mx-auto;
}

.section-title {
  @apply text-2xl font-semibold mb-2;
}

.section-text {
  @apply text-lg text-gray-700 mb-4;
}

.subsection {
  @apply pl-4 border-l-2 border-gray-300 my-4;
}

.subsection-title {
  @apply text-xl font-semibold mb-2;
}

.subsubsection {
  @apply pl-4 border-l-2 border-gray-200 my-4;
}

.subsubsection-title {
  @apply text-lg font-semibold mb-2;
}
</style>
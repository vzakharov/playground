<script setup lang="ts">

import Toggle from '~/components/shared/Toggle.vue';

const mode = reactive({
  dev: true,
});

const cv = computed(() => ({
  header: {
    title: 'Vova Zakharov',
    subtitle: mode.dev
      ? 'AI tinkerer • coding fanatic • word alchemist'
      : 'Tech copywriter • word alchemist • creative problem solver'
  },
  sections: [
    {
      title: 'Bio',
      text: mode.dev
        ? 'Hey there! I’ve been messing around with tech, AI, and words for over 20 years. Sometimes, I mix them all up and see what comes out. I find joy in creating projects that stir curiosity, challenge norms, and ultimately, make a difference.'
        : 'Hey there! I’m a tech enthusiast who has been playing with words for over two decades. Whether it’s crafting engaging blog posts, driving social media narratives, or creating the content for industry-leading conferences, I’ve done it all. My secret sauce is making hard things easy to understand, connecting the dots, and finding creative ways to solve marketing challenges.'
    },
    {
      title: 'Experience',
      subsections: mode.dev
        ? [
          {
            title: 'Voicemod (Experience and Innovation team), January-September 2023',
            text: 'Developed prototypes for Voicemod’s experimental ideas. Built a Discord bot - the bot-making process was as simple as writing in YAML. Cobbled together a Python-based web API resembling chatgpt’s web interface, but operating with a local python model for generation.',
          },
          {
            title: 'Personal projects (Since 2020)',
            text: '',
            subsections: [
              {
                title: 'Jukebox Web UI',
                text: 'Created a web UI built on top of Gradio and runs on Google Colab (yes, I used Google Colab as an actual server).',
              },
              {
                title: '“almostmagic” package',
                text: 'Simplified the integration of LLMs into projects. Just one line of code and it feels almost like magic.',
              },
              {
                title: 'JobGenie - An AI-powered job creation tool',
                text: 'A nifty AI tool that assists in job searches and even allows you to invent your own roles.',
              },
            ],
          },
          {
            title: '2006–2023: Copywriter & Diverse Roles in Marketing, Sales, and Tech Support',
            text: 'Throughout these roles, I consistently leveraged self-developed software tools to enhance and automate various aspects of my work, highlighting my passion for blending technology with traditional job functions.',
          },
        ]
        : [
          {
            title: 'Editor-in-chief roles',
            subsections: [
              {
                title: 'Smartcat (2016–2020)',
                text: 'At Smartcat, I was responsible for most of its content, including blog posts, social media posts, and help articles. I led the blog to become #1 in the translation industry. I also crafted the story and content for ’LocFromHome’, the biggest online localization conference at that time.',
              },
              {
                title: 'Edged.ai (2021–2022)',
                text: 'At Edged.ai, a hardware AI IP core vendor, I leveraged my tech understanding and writing skills to create compelling narratives for a highly complex product.',
              },
              {
                title: 'Into23 (2021–2022)',
                text: 'At this Hong Kong-based translation agency, I utilized my 20+ years of experience in the translation industry to manage the content strategy, ensuring consistent messaging across all platforms.',
              },
            ],
          },
          {
            title: 'Freelance copywriter (late 2000s-present)',
            text: 'Over the years, I’ve taken hundreds of freelance jobs, primarily in high-tech industries. I’ve mastered the art of turning complex tech concepts into digestible content that not only educates but also engages the audience.',
          },
          {
            title: 'Sales/presales engineer roles (2004–2015)',
            text: 'Created a significant amount of sales-related content such as RFP bids at large telecom/software companies such as Orga Systems, NetDialogue, Paragon Software AG, and CBOSS.',
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
}));

</script>

<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="flex flex-row items-center gap-2">
        <span :class="{
          'text-gray-300': mode.dev,
          'text-gray-800': !mode.dev,
        }">
          Copywriter
        </span> 
        <Toggle class="print:hidden"
          v-model="mode.dev" 
        />
        <span :class="{
          'text-gray-300': !mode.dev,
          'text-gray-800': mode.dev,
        }">
          Developer
        </span> 
      </div>
      <div>
        <div class="flex flex-row justify-between items-center text-xs">
          <h1 class="title" v-text="cv.header.title"></h1>
          <!-- Email/LinkedIn/Twitter -->
          <a href="mailto:vzakharov@gmail.com" class="text-gray-300 hover:text-gray-800">
            ✉️ vzakharov@gmail.com
          </a>
        </div>
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
  @apply flex flex-col justify-center min-h-screen bg-gray-100 text-gray-800 max-w-4xl mx-auto px-8;
}

.header {
  @apply my-5;
}

.title {
  @apply text-4xl font-bold mb-2;
}

.subtitle {
  @apply text-xl text-gray-600;
}

.section {
  @apply my-2;
}

.section-title {
  @apply text-2xl font-semibold mb-2;
}

.section-text {
  @apply text-gray-700 mb-4;
}

.subsection {
  @apply pl-6 border-gray-300 my-4;
}

.subsection-title {
  @apply text-xl font-semibold mb-2;
}

.subsubsection {
  @apply pl-6 border-gray-200 my-4;
}

.subsubsection-title {
  @apply text-lg font-semibold mb-2;
}
</style>
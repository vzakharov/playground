<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="title">Vova Zakharov</h1>
        <p class="subtitle">AI Tinkerer • Coding Fanatic • Word Alchemist</p>
      </div>
    </div>

    <!-- Bio -->
    <div class="section">
      <h2 class="section-title">Bio</h2>
      <p class="section-text">Hey there! I've been messing around with tech, AI, and words for over 20 years.
        Sometimes, I mix them all up and see what comes out. I find joy in creating projects that stir curiosity,
        challenge norms, and ultimately, make a difference.</p>
    </div>

    <!-- Experience -->
    <div class="section">
      <h2 class="section-title">Experience</h2>
      <div class="subsection">
        <h3 class="subsection-title">Voicemod (Experience and Innovation team), January-September 2023</h3>
        <p class="section-text">Developed prototypes for Voicemod's experimental ideas. Built a Discord bot - the
          bot-making process was as simple as writing in YAML. Cobbled together a Python-based web API resembling
          chatgpt's web interface, but operating with a local python model for generation.</p>
      </div>
      <div class="subsection">
        <h3 class="subsection-title">Personal projects (Since 2020)</h3>

        <h4 class="subsubsection-title">Jukebox Web UI</h4>
        <p class="section-text">Created a web UI built on top of Gradio and runs on Google Colab. An innovative
          approach using Google Colab as an actual server.</p>

        <h4 class="subsubsection-title">“almostmagic” package</h4>
        <p class="section-text">Simplified the integration of LLMs into projects. Just one line of code and it feels
          almost like magic.</p>

        <h4 class="project-title">JobGenie - An AI-powered job creation tool</h4>
        <p class="section-text">A revolutionary AI tool that doesn't just assist in job searches but invents unique
          job roles. Welcome to JobGenie.</p>
      </div>
      <div class="subsection">
        <h3 class="subsection-title">2006-2023: Copywriter & Diverse Roles in Marketing, Sales, and Tech Support
        </h3>
        <p class="section-text">Throughout these roles, I consistently leveraged self-developed software tools to
          enhance and automate various aspects of my work, highlighting my passion for blending technology with
          traditional job functions.</p>
      </div>
    </div>

    <!-- Education -->
    <div class="section">
      <h2 class="section-title">Education</h2>
      <div class="subsection">
        <h3 class="subsection-title">Moscow Institute of Physics and Technology</h3>
        <p class="section-text">Master, Engineering Physics/Applied Physics (2000 - 2006)</p>
      </div>
    </div>
  </div>
</template>
  
<style lang="postcss">
.container {
  @apply max-w-4xl mx-auto p-6 bg-white rounded;
}

.header {
  @apply flex items-center justify-between mb-6;
}

.title {
  @apply text-4xl font-bold mb-2;
}

.subtitle {
  @apply text-lg text-gray-600;
}

.section {
  @apply mb-8;
}

.section-title {
  @apply text-2xl font-semibold mb-4;
}

.section-text {
  @apply text-lg text-gray-700;
}

.subsection {
  @apply mb-4;
}

.subsection-title {
  @apply text-xl font-bold mt-5;
}

.subsubsection-title {
  @apply text-lg font-bold mt-4;
}

</style>
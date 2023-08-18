<template>
  <div>
    <!-- Password input for OpenAI API key -->
    <form>
      <label for="openaiApiKey">OpenAI API Key</label>
      <input id="openaiApiKey" type="password" v-model="openaiApiKey" autocomplete="on" />
    </form>
    <p>Open the browser console and start experimenting!</p>
  </div>
</template>

<script setup lang="ts">

import * as Magic from '~/lib/almostmagic2';
import { addProperties } from 'vovas-utils';
import { useLocalRef } from 'use-vova';
import yaml from 'js-yaml';

const openaiApiKey = useLocalRef('openaiApiKey', '');

watch( openaiApiKey, (value) => {
  addProperties(window, {
    process: {
      env: {
        OPENAI_API_KEY: value
      }
    }
  });
}, { immediate: true });

addProperties(window, { ...Magic, yaml });

</script>
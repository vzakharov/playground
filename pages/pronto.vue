<script setup lang="ts">

import _ from 'lodash';
import { computed, ref } from 'vue';
import Button from '~/components/shared/Button.vue';
import Dropdown from '~/components/shared/Dropdown.vue';
import Input from '~/components/shared/Input.vue';
import Textarea from '~/components/shared/Textarea.vue';
import Sidebarred from '~/components/shared/Sidebarred.vue';
import { defaultProntoData, parseInputs } from '~/lib/pronto';
import { switchRole, chatRoles, says } from '~/lib/vovas-openai';
import { uniqueId } from '~/lib/utils';
import { $throw } from 'vovas-utils';

const tab = ref('compose');

const { templates } = useLocalReactive('pronto-data', defaultProntoData);

const { selectedTemplateId } = toRefs(useLocalReactive('pronto-state', {
  selectedTemplateId: templates[0].id,
}));

useHashRoute(selectedTemplateId, id => {
  if (templates.some(t => t.id === id)) {
    return id;
  }
  return templates[0].id;
});

const selectedTemplate = computed(() => templates.find(t => t.id === selectedTemplateId.value));

function changeId(newId: string) {
  (
    selectedTemplate.value
      ?? $throw('selectedTemplate is undefined')
  ).id = newId;
  selectedTemplateId.value = newId;
};

const messages = computed(() => selectedTemplate.value?.messages ?? []);

const output = ref('');

const addMessage = () => {
  messages.value.push({ content: '', role: switchRole(_.last(messages.value)?.role) });
};

const inputs = computed(() => parseInputs(messages.value));

const run = async () => {
  throw new Error('Not implemented');
};

</script>

<template>
  <Sidebarred
    :sidebar-menu="{
      items: templates,
    }"
    v-model:sidebarMenuItemId="selectedTemplateId"
  >
    <template #sidebar-upper>
      <Button small outline
        caption="New template"
        @click="() => (
          templates.push({ id: uniqueId('template'), messages: [says.user('')] }),
          selectedTemplateId = _.last(templates)!.id
        )"
      />
    </template>
    <template #sidebar-lower>
      <GenieSettings appId="pronto" />
    </template>
    <div class="tab-container">
      <button class="tab-button" :class="{ active: tab === 'compose' }" @click="tab = 'compose'">Compose</button>
      <button class="tab-button" :class="{ active: tab === 'run' }" @click="tab = 'run'">Run</button>
    </div>

    <div v-if="tab === 'compose'" class="compose-container">
      <h2 class="heading">Template id</h2>
       <div class="flex">
          <Input
            :modelValue="selectedTemplateId"
            @update:modelValue="changeId"
            :invalidIf="id => templates.some(t => t.id === id && t.id !== selectedTemplateId)"
          />
          <Button small ghost
            v-if="templates.length > 1"
            caption="Delete"
            :confirm-prompt="'Type DELETE to confirm (there is no undo!)'"
            confirm-input="DELETE"
            @click="() => (
              templates.splice(templates.findIndex(t => t.id === selectedTemplateId), 1),
              selectedTemplateId = templates[0].id
            )"
          />
        </div>
      <h2 class="heading">Messages</h2>
      <div class="message-container" v-for="(message, index) in messages" :key="index">
        <Dropdown cycle-on-click :label="!index && 'Role'" class="role" :options="chatRoles" v-model="message.role" />
        <Textarea :label="!index && 'Message'" class="message-input" placeholder="Enter message"
          v-model="message.content"
          :max-height="800"
        />
        <Button small ghost class="self-end"
          caption="☒"
          @click="() => messages.splice(index, 1)"
        />
      </div>
      <Button primary outline
        caption="Add Message"
        @click="addMessage"
      />
    </div>

    <div v-else class="run-container">
      <Textarea v-for="(input, index) in inputs" :key="index" :label="_.startCase(input.name)" v-model="input.value" />
      <Button primary
        caption="Run"
        @click="run"
      />
      <div class="output-container">
        <label>Output:</label>
        <textarea readonly v-model="output" class="output-field"></textarea>
      </div>
    </div>
  </Sidebarred>
</template>

<style scoped lang="postcss">

.heading {
  @apply text-lg font-bold mt-8 mb-4;
}

.tab-container {
  @apply flex border-gray-200;
}

.tab-button {
  @apply px-4 py-2 bg-white rounded-t;
}

.tab-button.active {
  @apply border-l border-t border-r 
}

.tab-button:not(.active) {
  @apply border-b;
}

.compose-container, .run-container {
  @apply mt-4;
}

.message-container, .input-container {
  @apply flex space-x-2 items-start mb-2;
}


.role {
  @apply w-40;
}

.input-field, .output-field {
  @apply px-2 py-1 border rounded;
}

.add-message-button, .run-button {
  @apply px-4 py-2 bg-blue-500 text-white rounded mt-2;
}

.output-container {
  @apply mt-4;
}
</style>
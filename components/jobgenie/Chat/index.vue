<template>
  <div>
    <Button rounded small outline class="fixed top-0 mt-2 ml-2" 
      caption="↺ Start over"
      @click="startOver" 
    />
    <div v-for="(message, index) in messages" :key="index" class="mb-2 msg-container">
      <div :class="message.role === 'user' ? 'msg msg-user' : 'msg msg-assistant'">
        {{ message.content }}
      </div>
      <Button v-if="message.role === 'assistant'" small rounded outline class="ml-2 self-start" 
        caption="↺"
        @click="regenerate(message)"
      />
      <Button v-if="index && message.role === 'user'" small rounded outline class="ml-2 self-end" 
        caption="✎"
        @click="editMessage(message)"
      />
    </div>
    <div v-if="generating.inProgress" class="msg msg-assistant animate-pulse">
      ...
    </div>
    <form v-if="!lastMessageIsFromUser" @submit.prevent="sendMessage" class="input-container">
      <input v-model="userMessage" type="text" placeholder="Type your message here..." class="input-box" ref="userInput">
      <Button rounded small
        v-if="!!userMessage" 
        type="submit" 
        caption="↑"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useLocalReactive } from 'use-vova';
import { Resolvable, also } from 'vovas-utils';
import { username } from '~/components/jobgenie/username';
import Button from '~/components/shared/Button.vue';
import { generateResponse } from '~/lib/jobgenie';
import { ChatMessage, GenerateException, says } from '~/lib/vovas-openai';

  const { type } = defineProps<{
    type: 'interview'
  }>();

  const messages = useLocalReactive<ChatMessage[]>(`${type}Messages`, []);

  const lastMessageIsFromUser = computed(() => {
    const lastMessage = _.last(messages);
    return lastMessage && lastMessage.role === 'user';
  });

  const userMessage = ref('');

  function sendMessage() {
    const content = userMessage.value;
    if (content.trim() !== '') {
      messages.push(says.user(content));
      userMessage.value = '';
    }
  }

  function startOver() {
    if (window.confirm("Are you sure you want to start over? All current messages will be lost.")) {
      messages.splice(0, messages.length);
    }
  }

  const generating = reactive(new Resolvable({ startResolved: true }));

  watch(messages, async () => {

    await generating.promise;

    const lastMessage = _.last(messages) 
      ?? also(
        says.user(`Hi, I’m ${username.value}`), 
        m => messages.push(m)
      );

    if ( lastMessage.role === 'user' ) {
      try {
        generating.start();
        const response = await generateResponse(type, messages);
        messages.push(says.assistant(response));
      } catch (e: any) {
        if (e instanceof GenerateException) {
          // Remove last message and give an alert
          messages.pop();
          alert(e.message);
        }
      } finally {
        generating.resolve();
      }
    }
  }, { immediate: true });

  const userInput = ref<HTMLInputElement | null>(null);

  // function regenerate(index: number) {
  //   messages.splice(index, messages.length - index);
  // }
  function regenerate(message: ChatMessage) {
    // messages.splice(messages.indexOf(message), messages.length - messages.indexOf(message));
    removeMessagesFrom(message);
  };

  function editMessage(message: ChatMessage) {
    // userMessage.value = messages[index].content;
    // messages.splice(index, messages.length - index);
    // nextTick(() => {
    //   userInput.value.select();
    // });
    userMessage.value = message.content ?? '';
    // messages.splice(messages.indexOf(message), messages.length - messages.indexOf(message));
    removeMessagesFrom(message);
    nextTick(() => {
      userInput.value?.select();
    });
  }

  function removeMessagesFrom(message: ChatMessage) {
    messages.splice(messages.indexOf(message), messages.length - messages.indexOf(message));
  };

</script>

<style scoped lang="postcss">
.msg-container {
  @apply flex flex-col w-full;
}

.msg {
  @apply text-white p-2 px-4 rounded mb-2;
  max-width: 90%;
}

.msg-user {
  @apply bg-blue-500 self-end;
}

.msg-assistant {
  @apply bg-gray-500 self-start;
}

.input-container {
  @apply flex justify-end items-center mt-4;
}

.input-box {
  @apply border border-gray-300 rounded p-2 flex-grow mr-2;
}

</style>
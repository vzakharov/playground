import { AppChatMessage, ChatType, getActiveAssets, Resolvable } from "~/lib/jobgenie";
import { data } from "./data";
import { ChatController } from "./Chat/controller";

export const userMessage = ref('');

export const generating = ref<Resolvable<AppChatMessage<any, 'assistant'>>>();

export const msExpected = ref<number | null>(null);
export const dataLastLoaded = ref(Date.now());

export const activeAssets = computed(() =>
  getActiveAssets(data)
);

export function isActiveAssetFor(chat: ChatController<ChatType>, message: AppChatMessage<any, any>) {
  return message.assets && message.assets === activeAssets.value[chat.type]
};
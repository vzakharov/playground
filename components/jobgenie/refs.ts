import { JobGenieMessage, ChatType, getActiveAssets } from "~/lib/jobgenie";
import { ChatController } from "./Chat/controller";
import { data } from "./data";

export const dataLastLoaded = ref(Date.now());

export const activeAssets = computed(() =>
  getActiveAssets(data)
);

export function isActiveAssetFor<T extends ChatType>(chat: ChatController<T>, message: JobGenieMessage<T, any>) {
  return message.assets && message.assets === activeAssets.value[chat.type]
};
import { JobGenie, Tool } from "~/lib/jobgenie";
import { ChatController } from "./Chat/controller";
import { data } from "./data";
import { globalState } from "./state";

export const genie = new JobGenie({
  data,
  globalState,
  watch,
  alert
});

export const dataLastLoaded = ref(Date.now());

export const activeAssets = computed(() =>
  getActiveAssets(data)
);

export function isActiveAssetFor<T extends Tool>(chat: ChatController<T>, message: JobGenieMessage<T, any>) {
  return message.assets && message.assets === activeAssets.value[chat.type]
};
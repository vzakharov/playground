import { ChatData, ToolFrom, Toolset } from ".";

export function getGlobalDataInitializer<S extends Toolset>(tools: S) {
  return {
    chats: [] as ChatData<ToolFrom<S>, boolean>[],
    username: '',
  };
};

export type GlobalData<S extends Toolset> = ReturnType<typeof getGlobalDataInitializer<S>>;
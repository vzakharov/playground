import { ChatData, GenieSchema, Toolset, ToolName, ToolFrom, SetFor, AnyTool, Tool } from ".";

export function defaultGenieData<S extends Toolset>(tools?: Toolset) {
  return ({
    chats: [] as ChatData<ToolFrom<S>, any>[],
    username: ''
  });
};

export type GenieData<S extends Toolset> = ReturnType<typeof defaultGenieData<S>>;

export function assertDataIsForTool<
Reqs extends Toolset,
T extends Tool<any, any, Reqs>,
>(data: GenieData<SetFor<T>>, tool: T): asserts data is GenieData<SetFor<T> & Reqs> {
  if (!data.chats.some(chat => chat.toolId === tool.id)) {
    throw new Error(`GenieData is not for tool ${tool.id}`);
  }
};
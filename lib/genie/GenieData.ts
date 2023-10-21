import { ChatData, GenieSchema, Toolset, ToolName, ToolFrom, SetFor, AnyTool, Tool } from ".";

export function defaultGenieData<S extends Toolset>(tools?: Toolset) {
  return ({
    chats: [] as ChatData<ToolFrom<S>, any>[],
    username: ''
  });
};

export type GenieData<S extends Toolset> = ReturnType<typeof defaultGenieData<S>>;
import { GenieChat, GenieSchema, Toolset, ToolName, ToolFrom } from ".";

export function defaultGenieData<S extends Toolset>(tools?: Toolset) {
  return ({
    chats: [] as GenieChat<ToolFrom<S>>[],
    username: ''
  });
}

export type GenieData<S extends Toolset> = ReturnType<typeof defaultGenieData<S>>;
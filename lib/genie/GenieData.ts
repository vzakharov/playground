import { GenieChat, Schema, Tool } from ".";

export function defaultGenieData<S extends Schema>(schema: S) {
  return ({
    chats: [] as GenieChat<S, Tool<S>>[],
    username: ''
  });
}

export type GenieData<S extends Schema> = ReturnType<typeof defaultGenieData<S>>;
import { GenieChat, GenieSchema, Tool } from ".";

export function defaultGenieData<S extends GenieSchema>(schema: S) {
  return ({
    chats: [] as GenieChat<S, Tool<S>>[],
    username: ''
  });
}

export type GenieData<S extends GenieSchema> = ReturnType<typeof defaultGenieData<S>>;
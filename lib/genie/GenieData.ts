import { GenieChat } from "./GenieChat";

export function defaultGenieData<T extends string>() {
  return ({
    chats: [] as GenieChat<T, string>[],
  });
}

export type GenieData<T extends string> = ReturnType<typeof defaultGenieData<T>>;
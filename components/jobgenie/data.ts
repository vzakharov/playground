import { AppChat, AppData, ChatType, findBy, forEach } from "~/lib/jobgenie";
import _ from "lodash";
import { useLocalReactive, useLocalReactiveRef, useLocalRef } from "use-vova";
import { also } from "vovas-utils";

export const dataRef = useLocalReactiveRef<AppData>('jobgenie', {
  chats: [],
  assets: {}
});

export const data = getSettersFromRef(dataRef);

export function getSettersFromRef<T extends object>(ref: Ref<T>) {
  const result = {} as T;
  forEach(ref.value, (value, key) => {
    Object.defineProperty(result, key, {
      get: () => ref.value[key],
      set: (newValue) => ref.value[key] = newValue
    });
  });
  return result;
};

export const dataLoadedTimestamp = useLocalRef('jobgenie-data-loaded', Date.now())

export function findOrCreateChat<T extends ChatType>(type: T) {
  const { chats } = data;
  return (
    findBy({ type }, chats)
      ?? also(
        { type, messages: [] },
        chat => chats.push(chat)
      ) 
  ) as AppChat<T>;
}
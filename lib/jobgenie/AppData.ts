import { forEach } from "vovas-utils";
import { ChatType } from "./ChatType";
import { JobGenieChat } from "./JobGenieChat";
import { RefLike } from "../utils/utils";

export const defaultData = {
  chats: [] as JobGenieChat<ChatType>[],
  username: '',
  profileSlug: 'default',
};

export type AppData = typeof defaultData;

export function assertPartialAppData(data: any): asserts data is Partial<AppData> {
  forEach(defaultData, (value, key) => {
    if ( key in data && typeof data[key] !== typeof value ) {
      throw new Error(`Data key ${key} is of type ${typeof data[key]} but should be of type ${typeof value}`);
    }
  });
};

export function replaceAppDataWithUknown(data: AppData, newData: unknown, dataLastLoaded: RefLike<number>) {
  assertPartialAppData(newData);
  resetAppData(data, newData, dataLastLoaded);
};

export function resetAppData(data: AppData, newData: Partial<AppData>, dataLastLoaded: RefLike<number>) {
  forEach(defaultData, (defaultValue, key) => {
    data[key] = newData[key] ?? defaultValue;
  });
  dataLastLoaded.value = Date.now();
};
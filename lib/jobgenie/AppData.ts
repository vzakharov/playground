import { forEach } from "vovas-utils";
import { getDefaultData } from "~/lib/genie";
import { tools } from "./prompting/tools";
import { RefLike } from "lib/utils";

export const defaultData = {
  ...getDefaultData(tools),
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

export function replaceAppDataWithUnknown(data: AppData, newData: unknown, dataLastLoaded: RefLike<number>) {
  assertPartialAppData(newData);
  resetAppData(data, newData, dataLastLoaded);
};

export function resetAppData(data: AppData, newData: Partial<AppData>, dataLastLoaded: RefLike<number>) {
  forEach(defaultData, (defaultValue, key) => {
    data[key] = newData[key] ?? defaultValue;
  });
  dataLastLoaded.value = Date.now();
};
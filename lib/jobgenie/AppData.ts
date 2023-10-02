import { forEach } from "vovas-utils";
import { ChatType } from "./ChatType";
import { AppChat } from "./types";


export type AppData = {
  username: string | null;
  chats: AppChat<ChatType>[];
};

export const defaultData: AppData = {
  chats: [],
  username: null,
};

export function assertAppData(data: any): asserts data is AppData {
  forEach(defaultData, (value, key) => {
    // return key in data && typeof data[key] === typeof value;
    if (!(key in data)) {
      throw new Error(`${key} missing`);
    }
  });
};
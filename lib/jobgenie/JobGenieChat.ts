import { JobGenieMessage } from "./JobGenieMessage";
import { ChatType } from "./ChatType";
import { GenieChat } from "lib/genie/GenieChat";
import { AssetKeyForChatType } from "./assets";

export type JobGenieChat<T extends ChatType> = GenieChat<T, AssetKeyForChatType<T>>;
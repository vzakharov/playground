import { JobGenieMessage } from "./JobGenieMessage";
import { Tool } from "./ChatType";
import { GenieChat } from "lib/genie/GenieChat";
import { AssetKeyForChatType } from "./assets";

export type JobGenieChat<T extends Tool> = GenieChat<T, AssetKeyForChatType<T>>;
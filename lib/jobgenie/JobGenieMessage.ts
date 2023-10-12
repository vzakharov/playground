import { ChatRole, ChatMessage as RawChatMessage, chatRoles, says as rawSays } from "~/lib/vovas-openai";
import { AssetKeyForChatType, AssetsForChatType } from ".";
import { objectWithKeys } from "vovas-utils";
import { ChatType } from "./ChatType";
import { GenieMessage } from "lib/genie";


export type JobGenieMessage<T extends ChatType, R extends ChatRole = ChatRole> =
  GenieMessage<AssetKeyForChatType<T>, R>;
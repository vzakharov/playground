import { ChatRole, ChatMessage as RawChatMessage, chatRoles, says as rawSays } from "~/lib/vovas-openai";
import { AssetKeyForChatType, AssetsForChatType } from ".";
import { objectWithKeys } from "vovas-utils";
import { Tool } from "./ChatType";
import { GenieMessage } from "lib/genie";


export type JobGenieMessage<T extends Tool, R extends ChatRole = ChatRole> =
  GenieMessage<AssetKeyForChatType<T>, R>;
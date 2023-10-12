import { ChatMessage, ChatRole } from "~/lib/vovas-openai";
import { WithId, WithKeys } from ".";

export type GenieMessage<AssetKey extends string, R extends ChatRole = ChatRole> =
  ChatMessage<R> &
  WithId & {
    content: string;
    assets?: WithKeys<AssetKey>;
    assetsPickedAt?: number;
  };
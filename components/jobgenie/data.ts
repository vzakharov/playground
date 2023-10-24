import { useLocalReactive } from "~/composables/useLocalReactive";
import { ChatData, ChatId } from "~/lib/genie";
import { defaultData, Tool, ToolId } from "~/lib/jobgenie";
import { morph } from "~/lib/utils";

export type ChatDataV00 = ({
  type: Exclude<ToolId, 'resume'> | 'resumé';
} & Omit<ChatData<Tool, true>, 'toolId' | 'id'>);

export const migrators = [{
  version: '0.1',
  migrate: ({ chats }: {
    chats: ChatDataV00[]
  }) => {
    for ( const chat of chats ) {
      const { type, ...rest} = chat;
      const toolId = type === 'resumé' ? 'resume' : type;
      morph(chat, {
        toolId,
        id: toolId as ChatId,
        ...rest
      });
    };
  }
}] as const;

export const globalData = useLocalReactive('jobgenie-data', defaultData, migrators);

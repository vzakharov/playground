import { AppChatMessage, ChatType, getPromptBuilder } from "~/lib/jobgenie";
import { ChatController } from "./controller";
import { data } from "../data";
import { reduceChatMessages } from "~/lib/vovas-openai";
import { $throw } from "vovas-utils";

export function countIrrelevantMessages<T extends ChatType>(this: ChatController<T>) {

  // This function checks how many messages will be used to generate the response (due to the constraint of max. `charLimit` JSON characters in the prompt).
  // This is done by adding messages one by one (from the end), until `reduceChatMessages` no longer removes any messages from the prompt.

  const { type } = this;
  const originalMessages = [...this.messages];
  const relevantMessages = [] as AppChatMessage<T>[];
  const builder = getPromptBuilder(type);
  let previousJsonChars = 0;

  while (true) {
    const { promptMessages } = builder.build({ messages: relevantMessages, data });
    const jsonChars = reduceChatMessages({ promptMessages });
    if ( 
      jsonChars === previousJsonChars 
      || !originalMessages.length
    )
      return originalMessages.length - relevantMessages.length;
    previousJsonChars = jsonChars;
    relevantMessages.unshift(
      originalMessages.pop()
        ?? $throw(`No more messages to add to the prompt (this should never happen)`)
    );
  };

};

export function isRelevant<T extends ChatType>(this: ChatController<T>, message: AppChatMessage<T>) {
  return this.messages.indexOf(message) >= this.countIrrelevantMessages();
};
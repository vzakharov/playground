import { globalData } from "../vue-genie/data";
import { reduceChatMessages } from "~/lib/vovas-openai";
import { $throw } from "vovas-utils";
import { AnyTool, BaseChat, Chat, GenieMessage, Responder } from "~/lib/genie";

export function countIrrelevantMessages<T extends AnyTool>(chat: Responder<T, any, any>) {

  // This function checks how many messages will be used to generate the response (due to the constraint of max. `charLimit` JSON characters in the prompt).
  // This is done by adding messages one by one (from the end), until `reduceChatMessages` no longer removes any messages from the prompt.

  const { messages, config: { tool, globalData }} = chat;
  const originalMessages = [...messages];
  const relevantMessages = [] as GenieMessage<T>[];
  let previousJsonChars = 0;

  while (true) {
    const { promptMessages } = chat.getPrompt(relevantMessages);
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

export function isRelevant<T extends AnyTool>(this: BaseChat<T, any, any, any>, message: GenieMessage<T>) {
  return this.messages.indexOf(message) >= this.countIrrelevantMessages;
};
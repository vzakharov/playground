import { globalData } from "../../components/jobgenie/data";
import { reduceChatMessages } from "~/lib/vovas-openai";
import { $throw } from "vovas-utils";
import { AnyTool, BaseChat, Chat, GenieMessage } from "~/lib/genie";

export function countIrrelevantMessages<T extends AnyTool>(c: BaseChat<T, any>) {

  // This function checks how many messages will be used to generate the response (due to the constraint of max. `charLimit` JSON characters in the prompt).
  // This is done by adding messages one by one (from the end), until `reduceChatMessages` no longer removes any messages from the prompt.

  const { messages, config: { tool, globalData }} = c;
  const originalMessages = [...messages];
  const relevantMessages = [] as GenieMessage<T>[];
  let previousJsonChars = 0;

  while (true) {
    const { promptMessages } = tool.build({ messages: relevantMessages, globalData });
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

export function isRelevant<T extends AnyTool>(this: BaseChat<T, any>, message: GenieMessage<T>) {
  return this.messages.indexOf(message) >= this.countIrrelevantMessages;
};
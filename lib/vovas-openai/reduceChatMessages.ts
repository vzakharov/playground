import { ChatMessage, messagesBy, says } from ".";

export type ReduceChatMessagesParams = {
  promptMessages: ChatMessage[];
  charLimit?: number;
  removeFrom?: number;
  insertPlugMessage?: ChatMessage | false;
};

export function reduceChatMessages(params: ReduceChatMessagesParams) {
  const { 
    promptMessages, 
    charLimit = 8000,
    removeFrom = 1,
    insertPlugMessage = says.system('...messages removed for brevity...'),
  } = params;
  const jsonChars = JSON.stringify(promptMessages).length;
  const numResponses = messagesBy.assistant(promptMessages).length;
  console.log({ numResponses, jsonChars });
  if ( jsonChars > charLimit && numResponses > 2 ) {
    promptMessages.splice(removeFrom, 1);
    if ( insertPlugMessage )
      promptMessages.splice(removeFrom, 0, insertPlugMessage);
    return reduceChatMessages({ 
      ...params,
      removeFrom: insertPlugMessage ? removeFrom + 1 : removeFrom,
      // (If we inserted the plug message, we don’t want to remove it again)
      insertPlugMessage: false,
    });
  }
  return jsonChars;
};
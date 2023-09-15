import { ChatMessage, says } from ".";

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
  if ( jsonChars > charLimit ) {
    const { length } = promptMessages;
    console.log({ length, jsonChars });
    if (length > 2) {
      promptMessages.splice(removeFrom, 1);
      if ( insertPlugMessage )
        promptMessages.splice(removeFrom, 0, insertPlugMessage);
    } else {
      throw new Error('Cannot reduce promptMessages to at least 3 messages of < 2000 tokens total');
    }
    return reduceChatMessages({ 
      ...params,
      removeFrom: insertPlugMessage ? removeFrom + 1 : removeFrom,
      // (If we inserted the plug message, we don’t want to remove it again)
      insertPlugMessage: false,
    });
  }
  return jsonChars;
};
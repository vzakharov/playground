import { AppChatMessage, ChatType } from './types';
import { ChatFunctionFor } from './prompting';
import { ChatMessage } from 'lib/vovas-openai';
import { $throw } from 'vovas-utils';


export function toRawMessage<T extends ChatType>(fn?: ChatFunctionFor<T>) {

  return ({ assets, content, id, ...message }: AppChatMessage<T>) => ({
    ...!assets
      ? { content }
      : {
        content: null,
        function_call: {
          name: (fn
            ?? $throw("`fn` must be defined if `assets` are defined")
          ).name,
          arguments: JSON.stringify({ content, ...assets })
        },
      },
    ...message
  }) as ChatMessage;

}

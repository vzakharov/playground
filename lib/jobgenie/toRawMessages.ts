import { Tool } from "./ChatType";
import { JobGenieMessage } from "./JobGenieMessage";
import { ChatFunctionFor } from './prompting';
import { ChatMessage } from 'lib/vovas-openai';
import { $throw } from 'vovas-utils';
import _ from 'lodash';


export function toRawMessage<T extends Tool>(fn?: ChatFunctionFor<T>) {

  return (appChatMessage: JobGenieMessage<T> ) => {

    const { content, assets, role } = appChatMessage;

    return {
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
      role
    } as ChatMessage

  };

}

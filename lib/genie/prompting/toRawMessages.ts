import { $throw } from 'vovas-utils';
import { Flatpactable, flatpact } from '~/lib/utils';
import { ChatFunction, ChatMessage, ChatRole, says } from '~/lib/vovas-openai';
import { GenieMessage, Tool, Toolset } from '..';


export function toRawMessage<
  A extends string,
  Reqs extends Toolset
>(fn?: ChatFunction<string, A, never>) {

  return <R extends ChatRole>(message: GenieMessage<Tool<any, A, Reqs>, R>) => {

    const { content, assets, role } = message;

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
    } as ChatMessage<R>

  };

};

export function toRawMessages<
  A extends string,
  Reqs extends Toolset
>(fn?: ChatFunction<string, A, never>) {

  return (messages: Flatpactable<string | GenieMessage<Tool<any, A, Reqs>>>) => 
    flatpact(messages).map(message => 
      typeof message === 'string' 
        ? says.system(message)
        : toRawMessage(fn)(message)
    );

};

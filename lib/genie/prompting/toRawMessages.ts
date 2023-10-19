import { $throw } from 'vovas-utils';
import { ChatFunction, ChatMessage, ChatRole } from '~/lib/vovas-openai';
import { BuilderFunctionParameters, GenieMessage, GenieSchema, ToolName } from '..';


export function toRawMessage<
  S extends GenieSchema,
  T extends ToolName<S>
>(fn?: ChatFunction<string, BuilderFunctionParameters<S, T>, never>) {

  return <R extends ChatRole>(appChatMessage: GenieMessage<S, T, R> ) => {

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
    } as ChatMessage<R>

  };

}

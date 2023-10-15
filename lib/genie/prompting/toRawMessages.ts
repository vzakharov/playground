import { ChatFunction, ChatMessage, ChatRole } from '~/lib/vovas-openai';
import { $throw } from 'vovas-utils';
import _ from 'lodash';
import { AssetMap, AssetName, BuilderFunctionParameters, GenieChatType, GenieMessage } from '..';


export function toRawMessage<
  T extends GenieChatType,
  Map extends AssetMap<T>,
>(fn?: ChatFunction<string, BuilderFunctionParameters<Map, T>, never>) {

  return <R extends ChatRole>(appChatMessage: GenieMessage<AssetName, R> ) => {

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

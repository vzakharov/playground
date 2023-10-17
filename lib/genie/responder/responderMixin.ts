import _ from 'lodash';
import { addProperties, also, assign } from 'vovas-utils';
import { isBy } from '~/lib/vovas-openai';
import { 
  AssetName, BaseChatController, GenieChatType, LeftoversMixin, generateResponse, handleResponseGeneration 
} from '..';

export type ResponderMixinConfig = {
  watch: <T>(
    watched: T,
    callback: (value: T) => void,
    options?: { immediate: boolean }
  ) => void;
  alert: (message: string) => void;
};

export function responderMixin(config: ResponderMixinConfig) {

  const { watch, alert } = config;

  return function <T extends GenieChatType, A extends AssetName>(
    base: BaseChatController<T, A> & LeftoversMixin<A>
  ) {

    const { messages, data, autoMessage } = base;

    return {

      watchForResponseGeneration() {

        watch(messages, messages => {

          const lastMessage = _.last(messages)
            ?? also(
              autoMessage?.(data),
              m => m && messages.push(m)
            );
          if (!lastMessage || isBy.user(lastMessage)) {
            handleResponseGeneration.call(base, config);
          }
        }, { immediate: true });

      },

      generateResponse,
      handleResponseGeneration

    };

  };

};
import _ from 'lodash';
import { also } from 'vovas-utils';
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
};

export function responderMixin({ watch }: ResponderMixinConfig) {

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
            handleResponseGeneration.call(base);
          }
        }, { immediate: true });

      },

      generateResponse,
      handleResponseGeneration

    };

  };

};
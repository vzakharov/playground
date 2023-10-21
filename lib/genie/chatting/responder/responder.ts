import { $if, also, callWith, give, is, either } from 'vovas-utils';
import { isBy } from '~/lib/vovas-openai';
import { AnyTool, BaseChatControllerConfig, LeftoversController, generateResponse, handleResponseGeneration, says } from '../..';
import { isFunction } from '~/lib/utils';
import _ from 'lodash';

export class Responder<
  T extends AnyTool,
> extends LeftoversController<T, boolean> {

  constructor(
    public readonly config: BaseChatControllerConfig<T>
  ) {
    super(config);
    this.watchForResponseGeneration();
  };

  watchForResponseGeneration() {

    const { config: { watch, globalData, globalState, tool: { config: { autoQuery: autoQueryOrCallback }} }, messages } = this;

    watch(messages, messages => {

      const autoQuery = 
        typeof autoQueryOrCallback === 'function'
          ? autoQueryOrCallback({ globalData, globalState })
          : autoQueryOrCallback;

      const lastMessage = _.last(messages)
        ?? ( 
          !!autoQuery && also(
            says.user(autoQuery),
            m => messages.push(m)
          )
        );

      if (!lastMessage || isBy.user(lastMessage)) {
        this.handleResponseGeneration();
      }
    }, { immediate: true });

  };

  generateResponse = generateResponse;
  handleResponseGeneration = handleResponseGeneration;

};
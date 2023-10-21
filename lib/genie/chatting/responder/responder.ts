import _ from 'lodash';
import { also, callWith, give, is } from 'vovas-utils';
import { isBy } from '~/lib/vovas-openai';
import { AnyTool, BaseChatControllerConfig, LeftoversController, generateResponse, handleResponseGeneration, says } from '../..';
import { $if } from '~/lib/utils';

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
      // const autoQuery = $if(autoQueryOrCallback, is.function, callWith({ globalData, globalState })).else(give.itself);

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
import _ from 'lodash';
import { also } from 'vovas-utils';
import { inferIfFunction, pushedTo } from "~/lib/utils";
import { isBy } from '~/lib/vovas-openai';
import { AnyTool, BaseChatConfig, generateResponse, handleResponseGeneration, says } from '../..';
import { LeftoversController } from '../leftovers';

export class Responder<
  T extends AnyTool,
> extends LeftoversController<T, boolean> {

  constructor(
    public readonly config: BaseChatConfig<T>
  ) {
    super(config);
    this.watchForResponseGeneration();
  };

  watchForResponseGeneration() {

    const { config: { watch, globalData, globalState, tool }, messages } = this;

    watch(messages, messages => {

      const autoQuery = inferIfFunction(tool.config.autoQuery, { globalData, globalState });

      const lastMessage = _.last(messages)
        ?? ( 
          !!autoQuery 
            && pushedTo(messages, says.user(autoQuery))
        );

      if (!lastMessage || isBy.user(lastMessage)) {
        this.handleResponseGeneration();
      }
    }, { immediate: true });

  };

  generateResponse = generateResponse;
  handleResponseGeneration = handleResponseGeneration;

};
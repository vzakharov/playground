import _ from 'lodash';
import { also } from 'vovas-utils';
import { isBy } from '~/lib/vovas-openai';
import { AnyTool, BaseChatControllerConfig, LeftoversController, generateResponse, handleResponseGeneration } from '../..';

export class Responder<
  Id extends string,
  T extends AnyTool<Id>,
> extends LeftoversController<Id, T, boolean> {

  constructor(
    public readonly config: BaseChatControllerConfig<Id, T>
  ) {
    super(config);
    this.watchForResponseGeneration();
  };

  watchForResponseGeneration() {

    const { config: { watch, autoMessage, globalData: data }, messages } = this;

    watch(messages, messages => {

      const lastMessage = _.last(messages)
        ?? also(
          autoMessage?.(data),
          m => m && messages.push(m)
        );
      if (!lastMessage || isBy.user(lastMessage)) {
        this.handleResponseGeneration();
      }
    }, { immediate: true });

  };

  generateResponse = generateResponse;
  handleResponseGeneration = handleResponseGeneration;

};
import _ from 'lodash';
import { also } from 'vovas-utils';
import { isBy } from '~/lib/vovas-openai';
import { AnyTool, BaseChatControllerConfig, LeftoversController, generateResponse, handleResponseGeneration } from '../..';

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

    const { config: { watch, globalData: data, tool: { config: { autoMessage }} }, messages } = this;

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
import _ from 'lodash';
import { also } from 'vovas-utils';
import { isBy } from '~/lib/vovas-openai';
import { BaseChatControllerConfig, LeftoversController, GenieSchema, ToolName, generateResponse, handleResponseGeneration } from '../..';

export type ResponderMixinConfig = {
  watch: <T>(
    watched: T,
    callback: (value: T) => void,
    options?: { immediate: boolean }
  ) => void;
  alert: (message: string) => void;
};

export class Responder<
  S extends GenieSchema,
  T extends ToolName<S>,
> extends LeftoversController<S, T> {

  constructor(
    public readonly config: BaseChatControllerConfig<S, T> & ResponderMixinConfig
  ) {
    super(config);
    this.watchForResponseGeneration();
  };

  watchForResponseGeneration() {

    const { config: { watch, autoMessage, data }, messages } = this;

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
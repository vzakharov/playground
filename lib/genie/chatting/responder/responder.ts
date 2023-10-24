import _ from 'lodash';
import { also } from 'vovas-utils';
import { bound, inferIfFunction, pushedTo } from "~/lib/utils";
import { isBy } from '~/lib/vovas-openai';
import { AnyTool, BaseChatConfig, GenieMessage, generateResponse, getPrompt, handleResponseGeneration, says } from '../..';
import { LeftoversController } from '../leftovers';

export class Responder<
  T extends AnyTool,
> extends LeftoversController<T, boolean> {

  constructor(
    public readonly config: BaseChatConfig<T>
  ) {
    super(config);

  };

  get watcher() { return () => {

    const { messages, config: { globalData, globalState, tool } } = this;

    const autoQuery = inferIfFunction(tool.config.autoQuery, { globalData, globalState });

    const lastMessage = _.last(messages)
      ?? ( 
        !!autoQuery 
          && pushedTo(messages, says.user(autoQuery))
      );

    if (!lastMessage || isBy.user(lastMessage)) {
      this.handleResponseGeneration();
    }

  } };

  getPrompt = getPrompt;

  get prompt() { return this.getPrompt() };

  generateResponse = generateResponse;
  handleResponseGeneration = handleResponseGeneration;

};
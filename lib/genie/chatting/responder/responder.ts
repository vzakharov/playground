import _ from 'lodash';
import { inferIfFunction, pushedTo } from "~/lib/utils";
import { isBy } from '~/lib/vovas-openai';
import { AnyTool, BaseChatConfig, GlobalData, GlobalState, SetFor, countIrrelevantMessages, generateResponse, getPrompt, handleResponseGeneration, says } from '../..';
import { LeftoversController } from '../leftovers';

export class Responder<
  T extends AnyTool,
  GD extends GlobalData<SetFor<T>>,
  GS extends GlobalState
> extends LeftoversController<T, boolean, GD, GS> {

  constructor(
    public readonly config: BaseChatConfig<T, GD, GS>,
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

  get prompt() { return getPrompt.call(this) }

  generateResponse = generateResponse;
  handleResponseGeneration = handleResponseGeneration;

  get countIrrelevantMessages(): number { return countIrrelevantMessages(this) };

};
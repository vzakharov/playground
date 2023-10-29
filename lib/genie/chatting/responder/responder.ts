import _ from 'lodash';
import { inferIfFunction, pushedTo, undefinedProps } from "~/lib/utils";
import { isBy } from '~/lib/vovas-openai';
import { AnyTool, BaseChatConfig, GlobalData, GlobalState, SetFor, Tool, Toolset, countIrrelevantMessages, generateResponse, getActiveAssetsForSet, getPrompt, handleResponseGeneration, says } from '../..';
import { LeftoversController } from '../leftovers';

export class Responder<
  T extends Tool<any, any, Toolset>,
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

  getPrompt() {
    const { messages, config: { globalData, tool } } = this;
    return getPrompt(tool, messages, globalData);
  }

  get prompt(): ReturnType<typeof getPrompt> { return this.getPrompt() }

  generateResponse = generateResponse;
  handleResponseGeneration = handleResponseGeneration;

  get countIrrelevantMessages(): number { return countIrrelevantMessages(this) };

  get missingRequires() {
    const missingRequires = undefinedProps(this.activeAssets);
    return missingRequires.length ? missingRequires : undefined;
  };

  get activeAssets() {
    const { config: { tool: { config: { requires } },  globalData } } = this;
    return getActiveAssetsForSet(globalData, requires);
  };

};
import { isBy } from "~/lib/vovas-openai";
import _ from "lodash";
import { $throw } from "vovas-utils";
import { AnyTool, BaseChat, GlobalData, GenieMessage, GlobalState, LeftoversDefined, MessageId, SetFor } from "..";

export type Leftovers<T extends AnyTool> = {
  results: GenieMessage<T, 'assistant'>[];
  baseMessageId: MessageId;
  activeMessageOriginalIndex: number;
};

export class LeftoversController<
  T extends AnyTool,
  LD extends LeftoversDefined,
  GD extends GlobalData<SetFor<T>>,
  GS extends GlobalState
> extends BaseChat<T, LD, GD, GS> {

  areLeftoversDefined(): this is this & DefiniteLeftoversController<T, GD, GS> {
    return !!this.data.leftovers;
  };

  get messageWithLeftovers() {
    const { messages, data: { leftovers } } = this;
    const message = _.find(messages, { id: leftovers?.baseMessageId });
    if (message && !isBy.assistant(message)) {
      throw new Error('Message with leftovers is not by assistant (this should not happen)');
    };
    return message;
  };

  setLeftovers(leftovers: Leftovers<T>): asserts this is this & DefiniteLeftoversController<T, GD, GS> {
    Object.assign(this.data, { leftovers });
  };

};

export class DefiniteLeftoversController<
  T extends AnyTool,
  GD extends GlobalData<SetFor<T>>,
  GS extends GlobalState
> extends LeftoversController<T, true, GD, GS> {


  set messageWithLeftovers(
    message: GenieMessage<T, 'assistant'>
  ) {
    this.data.leftovers.baseMessageId = message.id;
  };


  replaceActiveMessageWithLeftover() {

    const { messages, messageWithLeftovers: message, data: { leftovers, leftovers: { results } } } = this;

    const leftover = results.shift()
      ?? $throw('Leftovers are empty (this should not happen)');

    this.messageWithLeftovers = leftover;

    messages.splice(messages.indexOf(message), 1, leftover);

    return { deletedMessage: message, leftovers };

  };

  cycleLeftovers() {

    const {
      deletedMessage,
      leftovers,
      leftovers: { activeMessageOriginalIndex, results }
    } = this.replaceActiveMessageWithLeftover();

    results.push(deletedMessage);

    leftovers.activeMessageOriginalIndex = (activeMessageOriginalIndex % (results.length + 1)) + 1;

  };

};
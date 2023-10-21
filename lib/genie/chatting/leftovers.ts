import { isBy } from "lib/vovas-openai";
import _ from "lodash";
import { $throw, ensure } from "vovas-utils";
import { AnyTool, BaseChatController, GenieMessage, LeftoversDefined, MessageId } from "..";

export type Leftovers<T extends AnyTool> = {
  results: GenieMessage<T, 'assistant'>[];
  baseMessageId: MessageId;
  activeMessageOriginalIndex: number;
};

export class LeftoversController<
  Id extends string,
  T extends AnyTool<Id>,
  LD extends LeftoversDefined
> extends BaseChatController<Id, T, LD> { 

  areLeftoversDefined(): this is this & DefiniteLeftoversController<Id, T> {
    return !!this.data.leftovers;
  }

};

export class DefiniteLeftoversController<
  Id extends string,
  T extends AnyTool<Id>
> extends LeftoversController<Id, T, true> {

  get messageWithLeftovers() {
    const { messages, data: { leftovers } } = this;
    const message = ensure(
      _.find(messages, { id: leftovers?.baseMessageId }),
      'Message with leftovers not found (this should not happen)'
    );
    if (!isBy.assistant(message)) {
      throw new Error('Message with leftovers is not by assistant (this should not happen)');
    };
    return message;
  };

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
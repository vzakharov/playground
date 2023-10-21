import { $throw, either, ensure, is } from "vovas-utils";
import { AnyTool, BaseChatController, GenieMessage, ChatTool, MessageId, Tool, ToolLeftoversStore, Toolset } from "..";
import { bound } from "~/lib/utils";
import _ from "lodash";
import { isBy } from "lib/vovas-openai";

export type Leftovers<T extends AnyTool> = {
  results: GenieMessage<T, 'assistant'>[];
  baseMessageId: MessageId;
  activeMessageOriginalIndex: number;
};

export type LeftoversDefined<T extends AnyTool> = {
  data: {
    leftovers: Leftovers<T>;
  };
  messageWithLeftovers: GenieMessage<T, 'assistant'>;
};

export class LeftoversController<
  Id extends string,
  T extends AnyTool<Id>,
> extends BaseChatController<Id, T> { 

  areLeftoversDefined(): this is LeftoversDefined<T> {
    return !!this.data.leftovers;
  }

  get messageWithLeftovers() {
    const { messages, data: { leftovers } } = this;
    const message = _.find(messages, { id: leftovers?.baseMessageId });
    if (message && !isBy.assistant(message)) {
      throw new Error('Message with leftovers is not by assistant (this should not happen)');
    };
    return message;
  };

  setMessageWithLeftovers(
    message: GenieMessage<T, 'assistant'>
  ) {
    if ( !this.areLeftoversDefined() ) {
      throw "Cannot set messageWithLeftovers as no leftovers are defined";
    };
    this.data.leftovers.baseMessageId = message.id;
  };


  replaceActiveMessageWithLeftover(
    this: this & LeftoversDefined<T>
  ) {

    const { messages, messageWithLeftovers: message, data: { leftovers, leftovers: { results } } } = this;

    const leftover = results.shift()
      ?? $throw('Leftovers are empty (this should not happen)');

    this.setMessageWithLeftovers(leftover);

    messages.splice(messages.indexOf(message), 1, leftover);

    return { deletedMessage: message, leftovers };

  };

  cycleLeftovers(
    this: this & LeftoversDefined<T>
  ) {

    const {
      deletedMessage,
      leftovers,
      leftovers: { activeMessageOriginalIndex, results }
    } = this.replaceActiveMessageWithLeftover();

    results.push(deletedMessage);

    leftovers.activeMessageOriginalIndex = (activeMessageOriginalIndex % (results.length + 1)) + 1;

  };

};
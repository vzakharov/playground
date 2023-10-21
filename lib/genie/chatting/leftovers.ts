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
};

export class LeftoversController<
  Id extends string,
  T extends AnyTool<Id>,
> extends BaseChatController<Id, T> { 

  areLeftoversDefined(): this is LeftoversDefined<T> {
    return !!this.data.leftovers;
  }

  getMessageWithLeftovers(
    this: this & LeftoversDefined<T>
  ) {
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

  setMessageWithLeftovers(
    this: this & LeftoversDefined<T>,
    message: GenieMessage<T, 'assistant'>
  ) {
    this.data.leftovers.baseMessageId = message.id;
  };


  replaceActiveMessageWithLeftover(
    this: this & LeftoversDefined<T>
  ) {

    const { messages, data: { leftovers, leftovers: { results } } } = this;
    const message = this.getMessageWithLeftovers();

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
import { $throw } from "vovas-utils";
import { AnyTool, BaseChatController, GenieMessage, MessageId, Tool, ToolLeftoversStore, Toolset } from "..";

export function getDefaultLeftovers<T extends AnyTool>(tool: T) {
  return {
    results: [] as GenieMessage<T, 'assistant'>[],
    baseId: null as MessageId | null,
    activeMessageOriginalIndex: 1,
  }
};

export type Leftovers<T extends AnyTool> = ReturnType<typeof getDefaultLeftovers<T>>;

export class LeftoversController<
  Id extends string,
  T extends AnyTool<Id>,
> extends BaseChatController<Id, T> {

  get defaultLeftovers() { return getDefaultLeftovers(this.config.tool); };

  get store(): ToolLeftoversStore<T> {
    const { config: { globalState: { leftoversStore }, tool } } = this;
    return leftoversStore[tool.id] ??= {};
  };

  get leftovers() {
    const { store, chat, defaultLeftovers } = this;
    return store[chat.id] ??= defaultLeftovers;
  };

  set leftovers( value: Leftovers<T> ) {
    const { store, chat } = this;
    store[chat.id] = value;
  };

  areLeftoversForMessage(
    message: GenieMessage<T, 'assistant'>
  ) {

    const { leftovers } = this;

    return !!message.id && (leftovers.baseId === message.id);

  };

  replaceActiveMessageWithLeftover(
    message: GenieMessage<T, 'assistant'>
  ) {

    const { leftovers, messages } = this;

    if (!this.areLeftoversForMessage(message))
      throw new Error('Leftovers are not for this message');

    const { results } = leftovers;

    const leftover = results.shift()
      ?? $throw('No leftovers left');

    leftovers.baseId = leftover.id;

    messages.splice(messages.indexOf(message), 1, leftover);

    return { deletedMessage: message, leftovers };

  };

  cycleLeftovers(
    message: GenieMessage<T, 'assistant'>
  ) {

    const {
      deletedMessage,
      leftovers,
      leftovers: { activeMessageOriginalIndex, results }
    } = this.replaceActiveMessageWithLeftover(message);

    results.push(deletedMessage);

    leftovers.activeMessageOriginalIndex = (activeMessageOriginalIndex % (results.length + 1)) + 1;

  };

};
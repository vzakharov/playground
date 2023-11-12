import { ChatCompletionMessage } from "openai/resources/chat";

export type Role = 'assistant' | 'user' | 'function' | 'system';

/**
 * A message that can be sent between agents.
 */
export type Message<R extends Role = Role> = {

  /** Content of the message, can be `null`. */
  content: string | null;

  /** A dictionary containing the function name and arguments */
  function_call?: ChatCompletionMessage.FunctionCall
  // TODO: Think if we need to convert to camelCase. Pros: consistent with js/ts. Cons: inconsistent with OpenAI API.

  /** Name of the function to be called */
  name?: string;
  // TODO: Check if this is a mistake.

  /** Role of the message. */
  role: R;

  /** Context of the message, which will be passed to {@link Completion.create}. For example,
   * one agent can send a message A as:
   * ```typescript
   * {
   *   content: (context) => context.use_tool_msg,
   *   context: {
   *     use_tool_msg: "Use tool X if they are relevant."
   *   }
   * }
   * ```
   * Next time, one agent can send a message B with a different `use_tool_msg`.
   * So effectively, this provides a way for an agent to send a "link" and modify
   * the content of the "link" later.
   */
  context?: Record<string, any>;


};

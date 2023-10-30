/**
 * A message that can be sent between agents.
 */
export type Message = {

  /** Content of the message, can be `null`. */
  content: string | null;

  /** Name of the function to be called. */
  function_call?: string;
  // TODO: Why is this `string`? Should be JSON schema.

  /** Name of the function to be called (TODO: check if this is a mistake). */
  name?: string;

  /** Role of the message. */
  role: 'assistant' | 'user' | 'function' | 'system';

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


}

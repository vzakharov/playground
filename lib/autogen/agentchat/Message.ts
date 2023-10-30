import { ChatCompletionMessage } from "openai/resources/chat";

  //         message (dict or str): message to be sent.
  //             The message could contain the following fields:
  //             - content (str): Required, the content of the message. (Can be None)
  //             - function_call (str): the name of the function to be called.
  //             - name (str): the name of the function to be called.
  //             - role (str): the role of the message, any role that is not "function"
  //                 will be modified to "assistant".
  //             - context (dict): the context of the message, which will be passed to
  //                 [Completion.create](../oai/Completion#create).
  //                 For example, one agent can send a message A as:
  //     ```python
  //     {
  //         "content": lambda context: context["use_tool_msg"],
  //         "context": {
  //             "use_tool_msg": "Use tool X if they are relevant."
  //         }
  //     }
  //     ```
  //                 Next time, one agent can send a message B with a different "use_tool_msg".
  //                 Then the content of message A will be refreshed to the new "use_tool_msg".
  //                 So effectively, this provides a way for an agent to send a "link" and modify
  //                 the content of the "link" later.

/**
 * A message that can be sent between agents.
 */
export type Message = {

  /** Content of the message, can be `null`. */
  content: string | null;

  /** Name of the function to be called. */
  function_call?: string;

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

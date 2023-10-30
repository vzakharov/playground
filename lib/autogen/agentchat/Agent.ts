// class Agent:
//     """(In preview) An abstract class for AI agent.

//     An agent can communicate with other agents and perform actions.
//     Different agents can differ in what actions they perform in the `receive` method.
//     """

//     def __init__(
//         self,
//         name: str,
//     ):
//         """
//         Args:
//             name (str): name of the agent.
//         """
//         # a dictionary of conversations, default value is list
//         self._name = name

//     @property
//     def name(self):
//         """Get the name of the agent."""
//         return self._name

//     def send(self, message: Union[Dict, str], recipient: "Agent", request_reply: Optional[bool] = None):
//         """(Abstract method) Send a message to another agent."""

//     async def a_send(self, message: Union[Dict, str], recipient: "Agent", request_reply: Optional[bool] = None):
//         """(Abstract async method) Send a message to another agent."""

//     def receive(self, message: Union[Dict, str], sender: "Agent", request_reply: Optional[bool] = None):
//         """(Abstract method) Receive a message from another agent."""

//     async def a_receive(self, message: Union[Dict, str], sender: "Agent", request_reply: Optional[bool] = None):
//         """(Abstract async method) Receive a message from another agent."""

//     def reset(self):
//         """(Abstract method) Reset the agent."""

//     def generate_reply(
//         self,
//         messages: Optional[List[Dict]] = None,
//         sender: Optional["Agent"] = None,
//         **kwargs,
//     ) -> Union[str, Dict, None]:
//         """(Abstract method) Generate a reply based on the received messages.

//         Args:
//             messages (list[dict]): a list of messages received.
//             sender: sender of an Agent instance.
//         Returns:
//             str or dict or None: the generated reply. If None, no reply is generated.
//         """

//     async def a_generate_reply(
//         self,
//         messages: Optional[List[Dict]] = None,
//         sender: Optional["Agent"] = None,
//         **kwargs,
//     ) -> Union[str, Dict, None]:
//         """(Abstract async method) Generate a reply based on the received messages.

//         Args:
//             messages (list[dict]): a list of messages received.
//             sender: sender of an Agent instance.
//         Returns:
//             str or dict or None: the generated reply. If None, no reply is generated.
//         """

/**
 * An abstract class for AI agent.
 * 
 * An agent can communicate with other agents and perform actions.
 * Different agents can differ in what actions they perform in the `receive` method.
 */
export abstract class Agent {

  /**
   * Construct an {@link Agent}.
   * 
   * @param name - The agent name.
   */
  constructor(
    public name: string,
  ) { }
  
  /**
   * Send a message to another agent.
   * 
   * @param message - The message.
   * @param recipient - The recipient agent.
   * @param requestReply - Whether to request a reply from the recipient.
   */
  abstract send(message: string | Message, recipient: Agent, requestReply?: boolean): Promise<void>;

  /**
   * Receive a message from another agent.
   * 
   * @param message - The message.
   * @param sender - The sender agent.
   * @param requestReply - Whether to request a reply from the sender.
   */
  abstract receive(message: string | Message, sender: Agent, requestReply?: boolean): Promise<void>;

  /**
   * Reset the agent.
   */
  abstract reset(): void;

  /**
   * Generate a reply based on the received messages.
   * 
   * @param messages - A list of messages received.
   * @param sender - The sender agent.
   * 
   * @returns The generated reply. If `null`, no reply is generated.
   */
  abstract generateReply(messages?: Message[], sender?: Agent): Promise<string | Message | null>;

};
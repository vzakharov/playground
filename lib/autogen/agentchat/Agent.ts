import { Message } from "./Message";

/**
 * Options for sending and receiving messages.
 */
export type SendReceiveOptions = {
  /** Whether to request a reply from the recipient. */
  requestReply?: boolean;
  /** Whether to suppress the message. Porting note: This option is not implemented in the Python version for the abstract `Agent` class, but is for {@link ConversableAgent}, leading to a type discrepancy, which is why this option is added here. */
  silent?: boolean;
};

/**
 * (In preview) An abstract class for AI agent.
 * 
 * An agent can communicate with other agents and perform actions.
 * Different agents can differ in what actions they perform in the `receive` method.
 */
export abstract class Agent {

  /** 
   * The agent id, created from the agent name. Used to create various maps between agents, such as {@link ConversableAgent#oaiMessages} and {@link ConversableAgent#replyAtReceive}. This is a js-only feature, as, unlike Python, javascript doesn't allow mapping keys to be objects themselves.
   */
  id: symbol;

  /**
   * Construct an {@link Agent}.
   * 
   * @param name - The agent name.
   */
  constructor(
    public name: string,
  ) { 
    this.id = Symbol(name);
  }
  
  /**
   * Send a message to another agent.
   * 
   * @param message - The message.
   * @param recipient - The recipient agent.
   * @param options - see {@link SendReceiveOptions}
   */
  abstract send(message: string | Message, recipient: Agent, options: SendReceiveOptions): Promise<void>;

  /**
   * Receive a message from another agent.
   * 
   * @param message - The message.
   * @param sender - The sender agent.
   * @param options - see {@link SendReceiveOptions}
   */
  abstract receive(message: string | Message, sender: Agent, options: SendReceiveOptions): Promise<void>;

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
  abstract generateReply({ messages, sender }: { messages?: Message[], sender?: Agent }): Promise<string | Message | null>;

};
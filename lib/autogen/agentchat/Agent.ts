import { Message } from "./Message";

/**
 * (In preview) An abstract class for AI agent.
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
  abstract send(message: string | Message, recipient: Agent, { requestReply }: { requestReply?: boolean }): Promise<void>;

  /**
   * Receive a message from another agent.
   * 
   * @param message - The message.
   * @param sender - The sender agent.
   * @param requestReply - Whether to request a reply from the sender.
   */
  abstract receive(message: string | Message, sender: Agent, { requestReply }: { requestReply?: boolean }): Promise<void>;

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
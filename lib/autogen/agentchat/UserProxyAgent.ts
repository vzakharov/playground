import { ConversableAgent, ConversableAgentOptions } from "./ConversableAgent";

/**
 * (In preview) A proxy agent for the user, that can execute code and provide feedback to the other agents.
 * 
 * `UserProxyAgent` is a subclass of {@link ConversableAgent} configured with `humanInputMode` to `"ALWAYS"`
 * and `llmConfig` to `false`. By default, the agent will prompt for human input every time a message is received.
 * Code execution is enabled by default. LLM-based auto reply is disabled by default.
 * To modify auto reply, register a method with {@link ConversableAgent#registerReply}.
 * To modify the way to get human input, override {@link ConversableAgent#getHumanInput} method.
 * To modify the way to execute code blocks, single code block, or function call, override {@link ConversableAgent#executeCodeBlocks},
 * {@link ConversableAgent#runCode}, and {@link ConversableAgent#executeFunction} methods respectively.
 * To customize the initial message when a conversation starts, override {@link ConversableAgent#generateInitMessage} method.
 */
export class UserProxyAgent extends ConversableAgent {

  /**
   * Construct a {@link UserProxyAgent}.
   * 
   * @param name - The agent name.
   * @param options - Optional constructor parameters (see {@link ConversableAgentOptions}).
   */
  constructor(
    name: string,
    options: ConversableAgentOptions = {}
  ) {
    super(name, {
      systemMessage: '',
      humanInputMode: 'ALWAYS',
      llmConfig: false,
      ...options
    });
  };

}
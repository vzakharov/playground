import { DEFAULT_MODEL, clear, ensure, pick } from "..";
import { Agent } from "./Agent";
import { Message } from "./Message";

/** A function that takes a message in the form of a dictionary and returns a boolean value indicating if this received message is a termination message. The dict can contain the following keys: "content", "role", "name", "function_call". */
export type IsTerminationMsg = (message: Message) => boolean;


/** Optional parameters for constructing an {@link ConversableAgent}. */
export type ConversableAgentOptions = {
  /** System message for the ChatCompletion inference. */
  systemMessage?: string;

  /** LLM inference configuration. Please refer to [Completion.create](/docs/reference/oai/completion#create) for available options. */
  llmConfig?: Record<string, any> | false;
  // TODO: Correct type for llmConfig

  /** A function used to determine if a message is a termination message, see {@link IsTerminationMsg} for details. */
  isTerminationMsg?: IsTerminationMsg;

  /** The maximum number of consecutive auto replies. Default to 100 (subject to future change). If not provided, static property {@link MAX_CONSECUTIVE_AUTO_REPLY} will be used. */
  maxConsecutiveAutoReply?: number;

  /** Whether to ask for human inputs every time a message is received. Possible values are `"ALWAYS"`, `"TERMINATE"`, `"NEVER"`:
   * 
   * (1) When `"ALWAYS"`, the agent prompts for human input every time a message is received. Under this mode, the conversation stops when the human input is `"exit"`, or when {@link isTerminationMsg} is `true` and there is no human input.
   * 
   * (2) When `"TERMINATE"`, the agent only prompts for human input only when a termination message is received or the number of auto reply reaches the {@link maxConsecutiveAutoReply}.
   * 
   * (3) When `"NEVER"`, the agent will never prompt for human input. Under this mode, the conversation stops when the number of auto reply reaches the {@link maxConsecutiveAutoReply} or when {@link isTerminationMsg} is `true`.
   */
  humanInputMode?: 'ALWAYS' | 'NEVER' | 'TERMINATE';

  /** Mapping function names (passed to openai) to callable functions. */
  functionMap?: Record<string, (...args: any[]) => any>;

  /** Config for the code execution, see {@link CodeExecutionConfig} for details. */
  codeExecutionConfig?: CodeExecutionConfig | false;

  /** Default auto reply when no code execution or LLM-based reply is generated. */
  defaultAutoReply?: string | Record<string, any>;
};

export type CodeExecutionConfig = {
  /** The working directory for the code execution. If undefined, a default working directory will be used. The default working directory is the "extensions" directory under "path_to_autogen". */
  // TODO: Figure out how this works
  workDir?: string;

  /** The docker image to use for code execution. If undefined, the code will be executed in the current environment. Default is `true` when <TODO: what npm package can we use for working with docker?> is installed. When set to `true`, a default list will be used. We strongly recommend using docker for code execution. */
  useDocker?: boolean | string | string[];

  /** The maximum execution time in seconds. */
  timeout?: number;

  /** The number of messages to look back for code execution. Default to 1. */
  lastNMessages?: number;
};


/**
 * Trigger for {@link ConversableAgent.registerReply}:
 * - If a class is provided, the reply function will be called when the sender is an instance of the class.
 * - If a string is provided, the reply function will be called when the sender's name matches the string.
 * - If an agent instance is provided, the reply function will be called when the sender is the agent instance.
 * - If a callable is provided, the reply function will be called when the callable returns `true`.
 * - If a list is provided, the reply function will be called when any of the triggers in the list is activated.
 * - If `null` is provided, the reply function will be called only when the sender is `null`.
 */
export type RegisterReplyTrigger = 
  typeof Agent
  | string 
  | Agent
  | null 
  | ((agent: Agent) => boolean) 
  | RegisterReplyTrigger[];

/**
 * Options for {@link ConversableAgent.registerReply}:
 */
export type RegisterReplyOptions = {
  
  /** The position of the reply function in the reply function list. The function registered later will be checked earlier by default. To change the order, set the position to a positive integer. */
  position?: number;

  /** The config to be passed to the reply function. When an agent is reset, the config will be reset to the original value. */
  config?: any;
  // TODO: Correct type for config

  /** The function to reset the config. */
  resetConfig?: (config: any) => void;
  // TODO: Correct type for config
};


/**
 * Reply function. The function takes a recipient agent, a list of messages, a sender agent and a config as input and returns a reply message.
 */
export type ReplyFunc = (
  recipient: ConversableAgent,
  messages?: Message[],
  sender?: Agent,
  config?: any
) => string | Message | null;

/**
 * (In preview) A class for generic conversable agents which can be configured as assistant or user proxy.
 * 
 * After receiving each message, the agent will send a reply to the sender unless the msg is a termination msg.
 * For example, {@link AssistantAgent} and {@link UserProxyAgent} are subclasses of this class,
 * configured with different default settings.
 * 
 * To modify auto reply, override {@link generateReply} method.
 * To disable/enable human response in every turn, set {@link humanInputMode} to `"NEVER"` or `"ALWAYS"`.
 * To modify the way to get human input, override {@link ConversableAgent.getHumanInput} method.
 * To modify the way to execute code blocks, single code block, or function call, override {@link ConversableAgent.executeCodeBlocks}, {@link ConversableAgent.runCode}, and {@link ConversableAgent.executeFunction} methods respectively.
 * To customize the initial message when a conversation starts, override {@link ConversableAgent.generateInitMessage} method.
 */
export class ConversableAgent extends Agent {

  static DEFAULT_CONFIG = {
    model: DEFAULT_MODEL
  } as const;

  /**
   * The maximum number of consecutive auto replies.
   * Default to 100 (subject to future change).
   */
  static MAX_CONSECUTIVE_AUTO_REPLY = 100 as const;

  /**
   * A dictionary of conversations.
   */
  private oaiMessages = {} as Record<string, Message[] | undefined>;

  private oaiSystemMessage = [] as {
    content: string;
    role: 'system';
  }[];

  private options: Required<ConversableAgentOptions>;
  
  private replyFuncList = [] as any[];
  // TODO: Correct type for replyFuncList

  replyAtReceive = {} as Record<string, boolean>;

  /**
   * Construct a {@link ConversableAgent}.
   * 
   * @param name - The agent name.
   * @param options - Optional constructor parameters (see {@link ConversableAgentOptions}).
   */
  constructor(
    public readonly name: string,
    options: ConversableAgentOptions = {}
  ) {
    super(name);
    this.options = {
      systemMessage: 'You are a helpful AI Assistant.',
      humanInputMode: 'TERMINATE',
      defaultAutoReply: '',
      isTerminationMsg: message => message.content === 'TERMINATE',
      llmConfig: {...ConversableAgent.DEFAULT_CONFIG},
      codeExecutionConfig: {},
      maxConsecutiveAutoReply: ConversableAgent.MAX_CONSECUTIVE_AUTO_REPLY,
      functionMap: {},
      ...options
    };
    this.registerReply([ Agent , null], ConversableAgent.generateOaiReply);
    this.registerReply([ Agent , null], ConversableAgent.generateCodeExecutionReply);
    this.registerReply([ Agent , null], ConversableAgent.generateFunctionCallReply);
    this.registerReply([ Agent , null], ConversableAgent.checkTerminationAndHumanReply);
  };

  /**
   * Append a message to the {@link ChatCompletion} conversation.
   * 
   * If the message received is a string, it will be put in the `content` field of the new dictionary.
   * If the message received is a dictionary but does not have any of the two fields `content` or `function_call`,
   * this message is not a valid {@link ChatCompletion} message.
   * If only `function_call` is provided, `content` will be set to `null` if not provided, and the role of the message will be forced `"assistant"`.
   * 
   * @param message - The message to be appended to the {@link ChatCompletion} conversation.
   * @param role - The role of the message, can be `"assistant"` or `"function"`.
   * @param conversationId - The id of the conversation, should be the recipient or sender.
   * 
   * @returns Whether the message is appended to the {@link ChatCompletion} conversation.
   */
  private appendOaiMessage(
    message: string | Message,
    role: 'assistant' | 'function',
    conversationId: Agent
  ) {
    const messageDict = this.messageToDict(message);
    // create oai message to be appended to the oai conversation that can be passed to oai directly.
    const oaiMessage = pick(messageDict, [
      "content", "function_call", "name", "context"
    ]) as Message;
    if ( oaiMessage.content === undefined ) {
      if ( 'function_call' in oaiMessage ) {
        oaiMessage.content = null; // if only function_call is provided, content will be set to `null`.
      } else {
        return false;
      };
    };
    oaiMessage.role = messageDict.role === 'function' ? 'function' : role;
    if ( oaiMessage.function_call !== undefined ) {
      oaiMessage.role = 'assistant'; // only messages with role 'assistant' can have a function call.
    };
    ensure(
      this.oaiMessages[conversationId.name],
      `Conversation with ${conversationId.name} not found in oaiMessages for ${this.name}.`
    ).push(oaiMessage);
    return true;
  };


  /**
   * Clear the chat history of the agent.
   * 
   * @param agent - The agent with whom the chat history to clear. If `undefined`, clear the chat history with all agents.
   */
  clearHistory(agent?: Agent) {
    if ( agent === undefined ) {
      clear(this.oaiMessages);
    } else {
      this.oaiMessages[agent.name] = [];
    };
  };

  /**
   * Generate the initial message for the agent.
   * 
   * Override this function to customize the initial message based on user's request.
   * If not overriden, "message" needs to be provided in the context.
   */
  generateInitMessage({ message }: { message: Message } & Record<string, any>) {
    return message;
    // TODO: Find a better way to do this
  };

  async generateReply(...args: Parameters<Agent['generateReply']>): ReturnType<Agent['generateReply']> {
   throw new Error('Not implemented'); 
  };

  /**
   * Initiate a chat with the recipient agent. Resets the consecutive auto reply counter. {@link ConversableAgent.generateInitMessage} is called to generate the initial message for the agent.
   * 
   * @param recipient - The recipient agent.
   * @param clearHistory - Whether to clear the chat history with the agent. If `true`, the chat history with the agent will be cleared. Default to `true`.
   * @param silent - (Experimental) Whether to print the messages for this conversation. Default to `false`.
   * @param message - Must be provided if the {@link ConversableAgent.generateInitMessage} method is not overridden.
   * @param context - Any context information.
   */
  async initiateChat(recipient: ConversableAgent, {
    message,
    clearHistory = true,
    silent = false,
    ...context
  }: {
    message: Message;
    // TODO: Implement a (generic?) check for whether ConversableAgent.generateInitMessage is overridden
    clearHistory?: boolean;
    silent?: boolean;
  } & Record<string, any>) {
    this.prepareChat(recipient, clearHistory);
    await this.send(
      this.generateInitMessage({ message, ...context }), 
      recipient, 
      { silent }
    );
  };

  /**
   * Convert a message to a dictionary.
   * 
   * The message can be a string or am object. The string will be put in the `content` field of the new object.
   */
  private messageToDict(message: string | Message) {
    if ( typeof message === 'string' ) {
      return { content: message } as Message;
    } else {
      return message;
    };
  }

  /**
   * Prepares the chat between this agent and the given recipient.
   * @param recipient - The agent to chat with.
   * @param clearHistory - Whether to clear the chat history between the two agents.
   */
  private prepareChat(recipient: ConversableAgent, clearHistory: boolean) {
    this.resetConsecutiveAutoReplyCounter(recipient);
    recipient.resetConsecutiveAutoReplyCounter(this);
    this.replyAtReceive[recipient.name] = recipient.replyAtReceive[this.name] = true;
    if ( clearHistory ) {
      this.clearHistory(recipient);
      recipient.clearHistory(this);
    }
  };

  /**
   * Receive a message from another agent.
   * 
   * Once a message is received, this function sends a reply to the sender or stop.
   * The reply can be generated automatically or entered manually by a human.
   * 
   * @param message - message from the sender. If object, see {@link Message} for details.
   * @param sender - sender of an {@link Agent} instance.
   * @param requestReply - whether a reply is requested from the sender. If undefined, the value is determined by {@link ConversableAgent.replyAtReceive} keyed by the sender.
   * @param silent - (Experimental) whether to print the message received.
   * 
   * @throws {Error} if the message can't be converted into a valid {@link ChatCompletion} message.
   */
  async receive(
    message: string | Message,
    sender: Agent,
    {
      requestReply,
      silent = false
    }: {
      requestReply?: boolean;
      silent?: boolean;
    } = {}
  ) {
    this.processReceivedMessage(message, sender, { silent });
    if ( requestReply === false || requestReply === undefined && this.replyAtReceive[sender.name] === false ) {
      return;
    };
    const reply = await this.generateReply({ sender });
    if ( reply !== null ) {
      await this.send(reply, sender, { silent });
    };
  };

  /**
   * Register a reply function.
   * 
   * The reply function will be called when the trigger matches the sender.
   * The function registered later will be checked earlier by default.
   * To change the order, set the position to a positive integer.
   * 
   * @param trigger - The trigger (see {@link RegisterReplyTrigger}).
   * @param replyFunc - The reply function (see {@link ReplyFunc}).
   * @param options - Optional parameters (see {@link RegisterReplyOptions}).
   */
  registerReply(
    trigger: RegisterReplyTrigger,
    replyFunc: (...args: any[]) => any, 
    options: RegisterReplyOptions = {}
  ) {

    const {
      position = 0,
      config = null,
      resetConfig = null
    } = options;

    // TODO: Implement runtime type checking (?)

    this.replyFuncList.splice(position, 0, {
      trigger,
      replyFunc,
      config: config,
      initConfig: config,
      resetConfig
    });
    
  };

  private consecutiveAutoReplyCounter = {} as Record<string, number | undefined>;

  /**
   * Reset the consecutive auto reply counter of the sender.
   */
  resetConsecutiveAutoReplyCounter(sender?: Agent) {
    if ( sender === undefined ) {
      clear(this.consecutiveAutoReplyCounter);
    } else {
      this.consecutiveAutoReplyCounter[sender.name] = 0;
    };
  };

  /**
   * Send a message to another agent.
   * 
   * @param message - message to be sent. See {@link Message} for details. Any role that is not `"function"` will be modified to `"assistant"`.
   * @param recipient - the recipient of the message.
   * @param requestReply - whether to request a reply from the recipient.
   * @param silent - (Experimental) whether to print the message sent.
   * 
   * @throws {Error} if the message can't be converted into a valid ChatCompletion message.
   */
  async send(
    message: string | Message,
    recipient: Agent, {
      requestReply = false,
      silent = false
    }: {
      requestReply?: boolean;
      silent?: boolean;
    } = {}
  ) {
    // When the agent composes and sends the message, the role of the message is "assistant"
    // unless it's "function".
    const valid = this.appendOaiMessage(message, "assistant", recipient);
    if ( valid ) {
      await recipient.receive(message, this, { requestReply, silent });
    } else {
      throw new Error(
        "Message can't be converted into a valid ChatCompletion message. Either content or function_call must be provided."
      );
    };
  };

};
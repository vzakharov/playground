/** A function that takes a message in the form of a dictionary and returns a boolean value indicating if this received message is a termination message. The dict can contain the following keys: "content", "role", "name", "function_call". */
// export type IsTerminationMsg = (message: Record<'content' | 'role' | 'name' | 'function_call', any>) => boolean;
export type IsTerminationMsg = (message: {
  content: string;
  role: string;
  // TODO: Enum for role
  name: string;
  function_call: any;
  // TODO: Correct type for function_call
}) => boolean;


/** Optional parameters for constructing an {@link ConversableAgent}. */
export type ConversableAgentOptions = {
  /** System message for the ChatCompletion inference. */
  systemMessage?: string;

  /** LLM inference configuration. Please refer to [Completion.create](/docs/reference/oai/completion#create) for available options. */
  llmConfig?: Record<string, any>;
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
 * (In preview) A class for generic conversable agents which can be configured as assistant or user proxy.
 * 
 * After receiving each message, the agent will send a reply to the sender unless the msg is a termination msg.
 * For example, {@link AssistantAgent} and {@link UserProxyAgent} are subclasses of this class,
 * configured with different default settings.
 * 
 * To modify auto reply, override {@link generateReply} method.
 * To disable/enable human response in every turn, set {@link humanInputMode} to "NEVER" or "ALWAYS".
 * To modify the way to get human input, override {@link getHumanInput} method.
 * To modify the way to execute code blocks, single code block, or function call, override {@link executeCodeBlocks},
 * {@link runCode}, and {@link executeFunction} methods respectively.
 * To customize the initial message when a conversation starts, override {@link generateInitMessage} method.
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
  private oaiMessages = {} as Record<string, any[]>;

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
    name: string,
    // {
    //   systemMessage = 'You are a helpful AI Assistant.',
    //   humanInputMode = 'TERMINATE',
    //   defaultAutoReply = '',
    //   isTerminationMsg = message => message.content === 'TERMINATE',
    //   llmConfig = {...ConversableAgent.DEFAULT_CONFIG},
    //   ...options
    // }: ConversableAgentOptions = {}
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

};

export type RegisterReplyTrigger = Agent | string | null | ((agent: Agent) => boolean) | RegisterReplyTrigger[];

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
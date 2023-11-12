import dedent from "dedent-js";
import { ChatCompletion, CodeBlock, CodeSource, DEFAULT_MODEL, DefaultMap, ExecuteCodeParams, Maybe, UNKNOWN, colored, ensure, executeCode, extractCode, inferLang, pick } from "..";
import { Agent, SendReceiveOptions } from "./Agent";
import { Message } from "./Message";
import readline from 'readline';

export type LlmConfig = {
  model?: 'gpt-4',
  allowFormatStrTemplate?: boolean;
};
// TODO: Complete as we figure out what the options are & doc after that

/** Optional parameters for constructing an {@link ConversableAgent}. */
/**
 * Options for creating a ConversableAgent.
 */
export type ConversableAgentOptions = {
  /**
   * System message for the ChatCompletion inference.
   */
  systemMessage?: string;

  /**
   * LLM inference configuration. Please refer to [Completion.create](/docs/reference/oai/completion#create) for available options. Porting note: The original Python code allowed `false` as a value. We'll just use undefined for this.
   */
  llmConfig?: LlmConfig;
  // TODO: Correct type for llmConfig

  /**
   * A function that takes a message in the form of a dictionary and returns a boolean value indicating if this received message is a termination message. The dict can contain the following keys: "content", "role", "name", "function_call".
   */
  isTerminationMsg?: (message: Message) => boolean;

  /**
   * The maximum number of consecutive auto replies. Default to 100 (subject to future change). If not provided, static property {@link MAX_CONSECUTIVE_AUTO_REPLY} will be used.
   */
  maxConsecutiveAutoReply?: number;

  /**
   * Whether to ask for human inputs every time a message is received. Possible values are `"ALWAYS"`, `"TERMINATE"`, `"NEVER"`:
   * 
   * (1) When `"ALWAYS"`, the agent prompts for human input every time a message is received. Under this mode, the conversation stops when the human input is `"exit"`, or when {@link isTerminationMsg} is `true` and there is no human input.
   * 
   * (2) When `"TERMINATE"`, the agent only prompts for human input only when a termination message is received or the number of auto reply reaches the {@link maxConsecutiveAutoReply}.
   * 
   * (3) When `"NEVER"`, the agent will never prompt for human input. Under this mode, the conversation stops when the number of auto reply reaches the {@link maxConsecutiveAutoReply} or when {@link isTerminationMsg} is `true`.
   */
  humanInputMode?: 'ALWAYS' | 'NEVER' | 'TERMINATE';

  /**
   * Mapping function names (passed to openai) to callable functions.
   */
  functionMap?: Record<string, ((args: {}) => any) | undefined>;

  /**
   * Config for the code execution, see {@link CodeExecutionConfig} for details.
   */
  codeExecutionConfig?: CodeExecutionConfig | false;

  /**
   * Default auto reply when no code execution or LLM-based reply is generated.
   */
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
 * Trigger for {@link ConversableAgent#registerReply}:
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
 * Config for a reply function /tba/
 */
export type ReplyConfig = { };

/**
 * Options for {@link ConversableAgent#registerReply}:
 */
export type RegisterReplyOptions = {
  
  /** The position of the reply function in the reply function list. The function registered later will be checked earlier by default. To change the order, set the position to a positive integer. */
  position?: number;

  /** The config to be passed to the reply function. When an agent is reset, the config will be reset to the original value. */
  config?: ReplyConfig;
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

/** Options for {@link ConversableAgent#generateReply} */
export type GenerateOptions<Config> = {
  /** Messages to include in the prompt, if any. */
  messages?: Message[];
  /** The sender of the message. */
  sender?: Agent;
  /** Config for the reply function. */
  config?: Config;
};

/**
 * (In preview) A class for generic conversable agents which can be configured as assistant or user proxy.
 * 
 * After receiving each message, the agent will send a reply to the sender unless the msg is a termination msg.
 * For example, {@link AssistantAgent} and {@link UserProxyAgent} are subclasses of this class,
 * configured with different default settings.
 * 
 * To modify auto reply, override {@link generateReply} method.
 * To disable/enable human response in every turn, set {@link humanInputMode} to `"NEVER"` or `"ALWAYS"`.
 * To modify the way to get human input, override {@link ConversableAgent#getHumanInput} method.
 * To modify the way to execute code blocks, single code block, or function call, override {@link ConversableAgent#executeCodeBlocks}, {@link ConversableAgent#runCode}, and {@link ConversableAgent#executeFunction} methods respectively.
 * To customize the initial message when a conversation starts, override {@link ConversableAgent#generateInitMessage} method.
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


  private consecutiveAutoReplyCounter = new DefaultMap<Maybe<Agent>, number>(Number);

  private maxConsecutiveAutoReplyDict = new DefaultMap<Maybe<Agent>, number>(Number);


  /**
   * A dictionary of conversations.
   */
  private oaiMessages = new DefaultMap<Maybe<Agent>, Message[]>(Array);

  private oaiSystemMessage = [] as {
    content: string;
    role: 'system';
  }[];

  private options: Required<ConversableAgentOptions>;
  
  private replyFuncList = [] as {
    trigger: RegisterReplyTrigger;
    replyFunc: ReplyFunc;
    config?: ReplyConfig;
    initConfig?: ReplyConfig;
    resetConfig?: ((config: ReplyConfig) => void);
  }[];
  // TODO: Correct type for replyFuncList

  // replyAtReceive = {} as Record<symbol, boolean>;
  replyAtReceive = new DefaultMap<Maybe<Agent>, boolean>(Boolean);

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
    this.registerReply([ Agent , null], this.generateOaiReply);
    // TODO: Do we need to bind this?
    this.registerReply([ Agent , null], this.generateCodeExecutionReply);
    this.registerReply([ Agent , null], this.generateFunctionCallReply);
    this.registerReply([ Agent , null], this.checkTerminationAndHumanReply);
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
   * @param role - The role of the message. (NOTE: The original python doc says this can be either "assistant" or "function", but there are instances in this very code when this is called with "user", so we're overriding the original doc.)
   * @param conversationId - The id of the conversation, should be the recipient or sender.
   * 
   * @returns Whether the message is appended to the {@link ChatCompletion} conversation.
   */
  private appendOaiMessage(
    message: string | Message,
    role: 'assistant' | 'function' | 'user',
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
      this.oaiMessages.get(conversationId),
      `Conversation with ${conversationId.name} not found in oaiMessages for ${this.name}.`
    ).push(oaiMessage);
    return true;
  };

  /**
   * Check if the conversation should be terminated, and if human reply is provided.
   * 
   * @param options - see {@link GenerateOptions}.
   */
  async checkTerminationAndHumanReply({ 
    sender, 
    messages = this.oaiMessages.get(sender), 
    config = this
  }: GenerateOptions<ConversableAgent> = {}) {
    const message = messages.at(-1);
    let reply = "";
    let noHumanInputMsg = "";

    if ( this.options.humanInputMode === 'ALWAYS' ) {
      reply = await this.getHumanInput(
        `Provide feedback to ${sender?.name}. Press enter to skip and use auto-reply, or type 'exit' to end the conversation: `
      );
      noHumanInputMsg = !reply ? "NO HUMAN INPUT RECEIVED." : "";
      reply ||= this.isTerminationMessage(message) ? "exit" : "";
    } else {
      if ( this.consecutiveAutoReplyCounter.get(sender) ?? 0 >= this.maxConsecutiveAutoReplyDict.get(sender) ) {
        if ( this.options.humanInputMode === 'NEVER' ) {
          reply = "exit";
        } else {
          // this.humanInputMode == "TERMINATE":
          const terminate = this.isTerminationMessage(message);
          reply = await this.getHumanInput(
            `Please give feedback to ${sender?.name}. Press enter or type 'exit' to stop the conversation: `
            + (terminate ? '' : `Please give feedback to ${sender?.name}. Press enter to skip and use auto-reply, or type 'exit' to stop the conversation: `)
          );
          noHumanInputMsg = !reply ? "NO HUMAN INPUT RECEIVED." : "";
          reply = reply || (terminate ? "exit" : "");
        };
      } else if ( this.isTerminationMessage(message) ) {
        if ( this.options.humanInputMode === 'NEVER' ) {
          reply = "exit";
        } else {
          // this.humanInputMode == "TERMINATE":
          reply = await this.getHumanInput(
            `Please give feedback to ${sender?.name}. Press enter or type 'exit' to stop the conversation: `
          );
          noHumanInputMsg = !reply ? "NO HUMAN INPUT RECEIVED." : "";
          reply = reply || "exit";
        };
      };
    };

    // print the noHumanInputMsg
    if ( noHumanInputMsg ) {
      console.log(
        colored.red( dedent`
          >>>>>>>> ${noHumanInputMsg}
        `)
      );
    };

    // stop the conversation
    if ( reply === "exit" ) {
      // reset the consecutiveAutoReplyCounter
      this.consecutiveAutoReplyCounter.set(sender, 0);
      return [ true, null ] as const;
    };

    // send the human reply
    if ( reply || this.maxConsecutiveAutoReplyDict.get(sender) === 0 ) {
      // reset the consecutiveAutoReplyCounter
      this.maxConsecutiveAutoReplyDict.set(sender, 0);
      return [ true, reply ] as const;
    };

    // increment the consecutiveAutoReplyCounter
    this.consecutiveAutoReplyCounter.set(sender, (this.consecutiveAutoReplyCounter.get(sender) ?? 0) + 1);
    if ( this.options.humanInputMode !== 'NEVER' ) {
      console.log(
        colored.red( dedent`
          >>>>>>>> USING AUTO REPLY...
        `)
      );
    };

    return [ false, null ] as const;
  };



  /**
   * Clear the chat history of the agent.
   * 
   * @param agent - The agent with whom the chat history to clear. If `undefined`, clear the chat history with all agents.
   */
  clearHistory(agent?: Agent) {
    if ( agent === undefined ) {
      this.oaiMessages.clear();
    } else {
      this.oaiMessages.delete(agent);
    };
  };

  /**
   * Execute the code blocks and return the result.
   * 
   * @param codeBlocks - A list of tuples, each containing the language and the code.
   */
  async executeCodeBlocks(codeBlocks: CodeBlock[]) {
    let logsAll = "";
    for ( let i = 0; i < codeBlocks.length; i++ ) {
      const block = codeBlocks[i];
      const [ , code] = block;
      const lang = block[0] || inferLang(code);
      console.log(
        colored.red( dedent`
          >>>>>>>> EXECUTING CODE BLOCK ${i} (inferred language is ${lang})...
        `)
      );

      const { exitCode, logs, image } = await (async () => {

        if ( lang !== UNKNOWN ) {
          if ( ['bash', 'shell', 'sh'].includes(lang) ) {
            return this.runCode({ code, lang });
          } else if ( lang.toLowerCase() === 'python' ) {
            const filename = code.startsWith('# filename: ') ? code.slice(11, code.indexOf('\n')).trim() : undefined;
            // TODO: Make less hacky
            return this.runCode({ code, lang, filename });
          }
        };
        
        // In case the language is not supported, we return an error message.
        return { exitCode: 1, logs: `unknown language: ${String(lang)}`, image: undefined };
        // throw new Error(`Language ${lang} not supported`);
        // TODO: Why was this commented out?
      })();
      if ( image ) {
        this.options.codeExecutionConfig ||= {};
        // Porting note: Original Python code doesn't check for `codeExecutionConfig` to be an object here.
        this.options.codeExecutionConfig.useDocker = image;
      };
      logsAll += '\n' + logs;
      if ( exitCode ) {
        return [ exitCode, logsAll ] as const;
      };
    };
    return [ 0, logsAll ] as const;
    // Porting note: Original Python code returns the latest `exitCode` here, but we already know it's 0 (because otherwise the function would have returned earlier), so we're just returning 0 here.
  };

  /**
   * Execute a function call and return the result.
   * 
   * Override this function to modify the way to execute a function call.
   * 
   * @param functionCall - A dictionary extracted from openai message at key `function_call` with keys `name` and `arguments`.
   * 
   * @returns a tuple of (`isExecSuccess`, `message`).
   * - `isExecSuccess` (boolean): whether the execution is successful.
   * - `message`: a dictionary with keys `name`, `role`, and `content`. Value of `role` is `"function"`.
   */
  executeFunction(functionCall: Message['function_call']) {
    const functionName = functionCall?.name ?? '';
    const func = this.options.functionMap?.[functionName];
    let isExecSuccess = false;
    let content: any;
    if ( func ) {
      // Extract arguments from a json-like string and put it into a dict.
      const inputString = ConversableAgent.formatJsonStr(functionCall?.arguments ?? '{}');
      let args: Record<string, any> | null;
      try {
        args = JSON.parse(inputString);
      } catch (e) {
        args = null;
        content = `Error: ${e}\n You argument should follow json format.`;
      };

      // Try to execute the function
      if ( args ) {
        console.log(
          colored.magenta( dedent`
            >>>>>>>> EXECUTING FUNCTION ${functionName}...
          `)
        );
        try {
          content = func(args);
          isExecSuccess = true;
        } catch (e) {
          content = `Error: ${e}`;
        };
      } else {
        content = `Error: Function ${functionName} not found.`;
      };

    } else {
      content = `Error: Function ${functionName} not found.`;
    };

    return [ isExecSuccess, {
      name: functionName,
      role: 'function',
      content: String(content)
    } ] as const;
  };

  /**
   * Remove newlines outside of quotes, and handle JSON escape sequences.
   * 
   * Porting note: Seems like JSON.parse already handles this, so we're just returning the input string here.
   */
  static formatJsonStr(jsonString: string) {
    return jsonString;
  };

  /**
   * Generate a reply using code execution.
   * 
   * @param options - see {@link GenerateOptions}.
   */
  async generateCodeExecutionReply({ messages, sender, config }: GenerateOptions<CodeExecutionConfig> = {}) {
    const codeExecutionConfig = config ?? this.options.codeExecutionConfig;
    if ( codeExecutionConfig === false ) {
      return [ false, null ] as const;
    };
    if ( !messages ) {
      messages = this.oaiMessages.get(sender);
    };
    const lastNMessages = codeExecutionConfig.lastNMessages ?? 1;

    // iterate through the last n messages in reverse
    // if code blocks are found, execute the code blocks and return the output
    // if no code blocks are found, continue
    for ( let i = 0; i < Math.min(messages.length, lastNMessages); i++ ) {
      const message = messages.at(-(i + 1));
      if ( !message?.content ) {
        continue;
      };
      const codeBlocks = extractCode(message.content);
      if ( codeBlocks.length === 1 && codeBlocks[0][0] === UNKNOWN ) {
        continue;
      }

      // found code blocks, execute code and push `lastNMessages` back
      const [ exitCode, logs ] = await this.executeCodeBlocks(codeBlocks);
      Object.assign(codeExecutionConfig, { lastNMessages });
      const exitCode2Str = exitCode === 0 ? 'execution succeeded' : 'execution failed';
      return [ true, dedent`
        exitcode: ${exitCode} (${exitCode2Str})
        Code output: ${logs}
      ` ] as const;

    };

    // no code blocks are found, push lastNMessages back and return.
    Object.assign(codeExecutionConfig, { lastNMessages });
    return [ false, null ] as const;
  };
      

  /**
   * Generate a reply using function call.
   * 
   * @param options - see {@link GenerateOptions}.
   */
  generateFunctionCallReply({ 
    sender, 
    messages = this.oaiMessages.get(sender),
    config = this
    // Porting note: `config` seems to be unused.
  }: GenerateOptions<ConversableAgent> = {}) {
    const message = messages.at(-1);
    if ( message?.function_call ) {
      const [ , funcReturn ] = this.executeFunction(message.function_call);
      return [ true, funcReturn ] as const;
    };
    return [ false, null ] as const;
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

  /**
   * Generate a reply using {@link oai}.
   * 
   * @param options: see {@link GenerateOptions}.
   */
  generateOaiReply({ 
    sender, 
    messages = this.oaiMessages.get(sender),
    config: llmConfig = this.options.llmConfig
  }: GenerateOptions<LlmConfig> = {}) {
    if ( !llmConfig ) {
      return null;
    };
    // TODO: (original #1143) handle token limit exceed error
    const response = ChatCompletion.create({
      context: messages[messages.length - 1]?.context,
      config: { messages: [ ...this.oaiSystemMessage, ...messages ] },
      ...llmConfig
    });
    return ChatCompletion.extractTextOrFunctionCall(response)[0];
  };

  async generateReply(...args: Parameters<Agent['generateReply']>): ReturnType<Agent['generateReply']> {
   throw new Error('Not implemented'); 
  };

  /**
   * Get human input.
   * 
   * Override this method to customize the way to get human input.
   * Porting note: The JavaScript implementation uses the readline module to get human input.
   */
  async getHumanInput(prompt: string) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const reply = await new Promise<string>(resolve => {
      rl.question(prompt, resolve);
    });
    rl.close();
    return reply;
  };
    

  /**
   * Initiate a chat with the recipient agent. Resets the consecutive auto reply counter. {@link ConversableAgent#generateInitMessage} is called to generate the initial message for the agent.
   * 
   * @param recipient - The recipient agent.
   * @param clearHistory - Whether to clear the chat history with the agent. If `true`, the chat history with the agent will be cleared. Default to `true`.
   * @param silent - (Experimental) Whether to print the messages for this conversation. Default to `false`.
   * @param message - Must be provided if the {@link ConversableAgent#generateInitMessage} method is not overridden.
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

  isTerminationMessage(message?: Message) {
    return message && this.options.isTerminationMsg?.(message);
  };

  /**
   * Convert a message to a dictionary.
   * 
   * @param message can be a string or an object. The string will be put in the `content` field of the new object.
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
    this.replyAtReceive.set(recipient, true);
    recipient.replyAtReceive.set(this, true);
    if ( clearHistory ) {
      this.clearHistory(recipient);
      recipient.clearHistory(this);
    }
  };


  /**
   * Print the message received.
   * @param message - The message received. NOTE: Original python doc allows message to be string, but the code doesn't seem to be able to handle that, so we're overriding the original doc by requiring message to be a Message object.
   * @param sender - The sender of the message.
   */
  private printReceivedMessage(message: Message, sender: Agent) {
    console.log(
      `${colored.yellow(sender.name)} (to ${this.name}):\n`
    );
    if ( message.role === 'function' ) {
      const funcPrint = `***** Response from calling function "${message.name}" *****`;
      console.log(
        dedent`
          ${colored.green(funcPrint)}
          ${message.content}
          ${colored.green("*".repeat(funcPrint.length))}
        `
      );
    } else {
      let { content, context } = message;
      const { llmConfig } = this.options;
      const { allowFormatStrTemplate } = llmConfig;
      if ( content !== null ) {
        if ( context ) {
          content = ChatCompletion.instantiate(
            content, {
              context,
              allowFormatStrTemplate
            }
          );
        };
        console.log(content);
      };
      if ( message.function_call ) {
        const funcPrint = `***** Suggested function Call: ${message.function_call.name ?? '(No function name found)'} *****`;
        console.log(
          dedent`
            ${colored.green(funcPrint)}
            Arguments: 
            ${message.function_call.arguments ?? '(No arguments found)'}
            ${colored.green("*".repeat(funcPrint.length))}
          `
        );
      };
    };
    console.log(
      `\n${"-".repeat(80)}`
    );
  };

  /**
   * Processes a received message from a sender.
   * @param message - The message to process, either a string or a Message object.
   * @param sender - The sender of the message.
   * @param options - Optional parameters for processing the message.
   * @param options.silent - If true, the received message will not be printed to the console.
   * @throws An error if the received message cannot be converted into a valid ChatCompletion message.
   */
  private processReceivedMessage(
    message: string | Message,
    sender: Agent,
    { silent = false }: { silent?: boolean } = {}
  ) {
    const messageDict = this.messageToDict(message);
    const valid = this.appendOaiMessage(messageDict, "user", sender);
    if ( !valid ) {
      throw new Error(
        "Received message can't be converted into a valid ChatCompletion message. Either content or function_call must be provided."
      );
    };
    if ( !silent ) {
      this.printReceivedMessage(messageDict, sender);
    };
  };

  /**
   * Receive a message from another agent.
   * 
   * Once a message is received, this function sends a reply to the sender or stop.
   * The reply can be generated automatically or entered manually by a human.
   * 
   * @param message - message from the sender. If object, see {@link Message} for details.
   * @param sender - sender of an {@link Agent} instance.
   * @param requestReply - whether a reply is requested from the sender. If undefined, the value is determined by {@link ConversableAgent#replyAtReceive} keyed by the sender.
   * @param silent - (Experimental) whether to supress the message received.
   * 
   * @throws {Error} if the message can't be converted into a valid {@link ChatCompletion} message.
   */
  async receive(
    message: string | Message,
    sender: Agent,
    {
      requestReply,
      silent = false
    }: SendReceiveOptions = {}
  ) {
    this.processReceivedMessage(message, sender, { silent });
    if ( requestReply === false || requestReply === undefined && this.replyAtReceive.get(sender) === false ){
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
      config,
      resetConfig
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

  reset() {
    this.clearHistory();
    this.resetConsecutiveAutoReplyCounter();
    this.stopReplyAtReceive();
    for ( const replyFuncTuple of this.replyFuncList ) {
      const { config, initConfig } = replyFuncTuple;
      if ( replyFuncTuple.resetConfig && config ) {
        // Porting note: Original Python code doesn't check for `config` to exist here.
        replyFuncTuple.resetConfig(config);
      } else {
        replyFuncTuple.config = initConfig && {...initConfig};
      };
    };
  };

  /**
   * Reset the consecutive auto reply counter of the sender.
   */
  resetConsecutiveAutoReplyCounter(sender?: Agent) {
    if ( !sender  ) {
      this.consecutiveAutoReplyCounter.clear();
    } else {
      this.consecutiveAutoReplyCounter.set(sender, 0);
    };
  };

  /**
   * Run the code and return the result. Same parameters and return values as {@link executeCode}.
   */
  runCode(params: ExecuteCodeParams) {
    return executeCode(params);
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
    }: SendReceiveOptions = {}
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

  /** Reset the replyAtReceive for the sender. If no sender is provided, reset the `replyAtReceive` for all senders. */
  stopReplyAtReceive(sender?: Agent) {
    if ( sender === undefined ) {
      this.replyAtReceive.clear();
    } else {
      this.replyAtReceive.set(sender, false);
    };
  };

};
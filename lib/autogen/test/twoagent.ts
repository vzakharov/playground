import { AssistantAgent, UserProxyAgent, configListFromJson } from '..';


export function testTwoAgents() {
  // Load LLM inference endpoints from an env variable or a file
  // See https://microsoft.github.io/autogen/docs/FAQ#set-your-api-endpoints
  // and OAI_CONFIG_LIST_sample
  const configList = configListFromJson('OAI_CONFIG_LIST');
  const assistant = new AssistantAgent('assistant', { llmConfig: { configList } });
  const userProxy = new UserProxyAgent('user_proxy', { codeExecutionConfig: { workDir: 'coding' } });
  userProxy.initiateChat({ recipient: assistant, clearHistory: { message: 'Plot a chart of NVDA and TESLA stock price change YTD.' } });
};
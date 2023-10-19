import dedent from "dedent-js";
import { ArrayItem, Falsible, StringKey, allPropsDefined, undefinedProps } from "~/lib/utils";
import {
  StackUpable, chatFunction, messagesBy, says, stackUp
} from "~/lib/vovas-openai";
import { Dict, GenieData, GenieMessage, getActiveAssets, reciteAssets, toRawMessage } from "..";


export type AnyTool<
  Id extends string=string, 
  Asset extends string=string, 
  Set extends Toolset=Toolset
> = Tool<Id, Asset, Set>;

export type Toolset = AnyTool[];

export type Requires<T extends AnyTool> = T['config']['requires'];

export type SetFor<T extends AnyTool> = ( T | ArrayItem<Requires<T>> )[];

export type ToolFrom<S extends Toolset> = ArrayItem<S>;

export type ToolIdFrom<S extends Toolset> = ToolFrom<S>['id'];

export function toolIds<S extends Toolset>(tools: S): ToolIdFrom<S>[] {
  return tools.map(tool => tool.id);
};

export type ToolWithId<S extends Toolset, Id extends ToolIdFrom<S>> =
  Extract<ToolFrom<S>, { id: Id }>;

export function toolWithId<S extends Toolset, Id extends ToolIdFrom<S>>(tools: S, id: Id): ToolWithId<S, Id> {
  return tools.find(tool => tool.id === id) as ToolWithId<S, Id>;
};

export type MissingTool<S extends Toolset> = Exclude<ToolFrom<SetFor<ToolFrom<S>>>, ToolFrom<S>>['id'];

export type ValidToolset<S extends Toolset> =
  MissingTool<S> extends never
    ? S
    : `Required tool missing, id = ${MissingTool<S>}`;

export type AssetForTool<T extends AnyTool> = StringKey<T['config']['assets']>;

export type ToTool<ST extends Toolset | AnyTool> = 
  ST extends Toolset ? ToolFrom<ST> : ST;

export type Asset<ST extends Toolset | AnyTool> = 
  AssetForTool<ToTool<ST>>;

export type AssetValues<T extends Toolset | AnyTool> = Dict<Asset<T>>;

export type BuildInput<S extends Toolset, T extends AnyTool> = {
  messages: GenieMessage<T>[];
  data: GenieData<S>;
};

export type AssetValuesForSet<S extends Toolset> = {
  [Id in ToolIdFrom<S>]: {
    [A in AssetForTool<ToolWithId<S, Id>>]: string;
  };
};

export type BuildSystemMessages<Reqs extends Toolset> = (params: {
  numResponses: number;
  requestFunctionCall: boolean;
  functionCalled: boolean;
  assets: AssetValuesForSet<Reqs>;
  username: Falsible<string>;
}) => Record<'pre' | 'post', StackUpable>;


export type ToolConfig<
  Asset extends string,
  Reqs extends Toolset,
> = {
  mainSystemMessage: string;
  accompanyingTextKey?: string;
  requestFunctionCallAfter: number;
  addAssetsAfter?: number;
  buildSystemMessages: BuildSystemMessages<Reqs>;
  // fnArgs: SimplifiedChatFunction<string, Asset, never>;
  assets: Dict<Asset>;
  requires: Reqs;
};

export class Tool<
  Id extends string,
  A extends string,
  Reqs extends Toolset,
> {

  constructor(
    public id: Id,
    public config: ToolConfig<A, Reqs>,
  ) { }

  build(input: BuildInput<Reqs, this>) {

    const { messages, data } = input;
    const { 
      mainSystemMessage, requestFunctionCallAfter, addAssetsAfter = 0,
      buildSystemMessages, assets: assetDescriptions, accompanyingTextKey = 'replyMessage', requires
    } = this.config;

    const fn = chatFunction('reply', 'Replies to the user with structured data', {
      [accompanyingTextKey]: 'Accompanying text to go before the structured data, narratively continuing the conversation',
      ...assetDescriptions
    });

    const numResponses = messagesBy.assistant(messages).length;
    const requestFunctionCall = numResponses >= requestFunctionCallAfter;
    const rawMessages = messages.map(toRawMessage(fn));

    // Check if there are already function calls in the messages
    const functionCalled = rawMessages.some(message => message.function_call);

    const assetValues = getActiveAssets(data, requires);

    if ( !allPropsDefined(assetValues) )
      throw new Error(`The following assets are missing: ${this.getMissingTools(assetValues).join(', ')}`);

    const { username } = data;

    const { 
      pre: preMessage, 
      post: postMessage 
    } = buildSystemMessages({ 
      functionCalled, numResponses, requestFunctionCall, assets: assetValues, 
      username,
      ...input
    });

    return {
      promptMessages: [
        says.system(
          stackUp([
            mainSystemMessage,
            preMessage, 
            requires && numResponses >= addAssetsAfter && dedent`
              For reference:

              ===
              ${reciteAssets(assetValues, requires)}
              ===
            `
          ])
        ),
        ...rawMessages,
        says.system(stackUp(postMessage))
      ],
      fn: requestFunctionCall ? fn : undefined
    };
  };

  getMissingTools(assetValues: Partial<AssetValuesForSet<Reqs>>): ToolFrom<Reqs>[] {
    return undefinedProps(assetValues).map(toolId => toolWithId(this.config.requires, toolId));
  };

};

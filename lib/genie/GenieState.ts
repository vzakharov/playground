import { is, ensured } from "vovas-utils";
import { Initializer, Initializee } from "~/lib/utils";
import { AnyTool, ChatId, Leftovers, ToolIdFrom, ToolWithId, Toolset, temperatureDescriptors } from ".";

export type ToolLeftoversStore<T extends AnyTool> = {
  [CId in ChatId]?: Leftovers<T>;
};

export type LeftoversStore<S extends Toolset> = {
  [TId in ToolIdFrom<S>]?: ToolLeftoversStore<ToolWithId<S, TId>>;
};

export const genieStateInitializer= {
  openaiKey: '',
  usdSpent: 0,
  useGpt4: true,
  savedMsPerPromptJsonChar: {
    'gpt-3.5-turbo': 5,
    'gpt-4': 15,
  },
  temperatureDescriptor: ensured(is.among(temperatureDescriptors)).else('normal'),
} satisfies Initializer<any>;

export type GenieState = Initializee<typeof genieStateInitializer>;
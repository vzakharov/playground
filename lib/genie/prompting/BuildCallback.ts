import { Falsible, Flatpactable } from "~/lib/utils";
import { GenieMessage, Tool } from "..";
import { Toolset, AssetValuesForSet } from "../tooling/types";


export type BuildCallback<
  Id extends string,
  Asset extends string,
  Reqs extends Toolset
> = (params: {
  numResponses: number;
  shouldGenerateAssets: boolean;
  functionCalled: boolean;
  assets: AssetValuesForSet<Reqs>;
  username: Falsible<string>;
}) => {
  pre?: Flatpactable<string | GenieMessage<Tool<Id, Asset, Reqs>>>;
  post?: Flatpactable<string | GenieMessage<Tool<Id, Asset, Reqs>>>;
};

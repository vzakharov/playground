import dedent from "dedent-js";
import { allPropsDefined, undefinedProps } from "~/lib/utils";
import {
  chatFunction, messagesBy, says, stackUp
} from "~/lib/vovas-openai";
import { AssetSpecs, AssetValuesForSet, BoundTool, BuildCallback, BuildInput, Genie, GenieContext, SetFor, ToolFrom, Toolset, assetDescriptions, getActiveAssetsForSet, reciteAssets, toRawMessage, toolWithId } from "..";

export type ToolConfig<
  Id extends string,
  Asset extends string,
  Reqs extends Toolset
> = {
  system: string;
  generateAssetsAfter: number;
  reciteAssetsAfter?: number;
  build: BuildCallback<Id, Asset, Reqs>;
  autoQuery?: string | ( ( context: GenieContext<Reqs, any, any>) => string );
  assets: AssetSpecs<Asset>;
  requires: Reqs;
};

export class Tool<
  Id extends string,
  A extends string,
  Reqs extends Toolset,
> {

  constructor(
    public id: Id,
    public config: ToolConfig<Id, A, Reqs>,
  ) { };

};
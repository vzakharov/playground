import dedent from "dedent-js";
import { allPropsDefined, undefinedProps } from "~/lib/utils";
import {
  chatFunction, messagesBy, says, stackUp
} from "~/lib/vovas-openai";
import { AssetSpecs, AssetValuesForSet, BuildCallback, BuildInput, GenieContext, ToolFrom, Toolset, assetDescriptions, getActiveAssetsForSet, reciteAssets, toRawMessage, toolWithId } from "..";

export type ToolConfig<
  Asset extends string,
  Reqs extends Toolset
> = {
  system: string;
  generateAssetsAfter: number;
  reciteAssetsAfter?: number;
  build: BuildCallback<Reqs>;
  autoQuery?: string | ( ( context: GenieContext<Reqs>) => string );
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
    public config: ToolConfig<A, Reqs>,
  ) { }

};
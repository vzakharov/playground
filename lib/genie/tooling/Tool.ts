import { AssetSpecs, BuildCallback, GenieContext, Toolset } from "..";

export type ToolConfig<
  Id extends string,
  Asset extends string,
  Reqs extends Toolset
> = {
  system?: string;
  generateAssetsAfter?: number;
  reciteAssetsAfter?: number;
  build: BuildCallback<Id, Asset, Reqs>;
  autoQuery?: string | ( ( context: GenieContext<Reqs, any, any>) => string );
  assets?: AssetSpecs<Asset>;
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
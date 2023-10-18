import _ from "lodash";
import { StringKey } from "vovas-utils";
import { AssetCaption } from "./assets";

export type GenieSchema = {

  [ToolName: string]: {
    [AssetName: string]: AssetCaption;
  };
  
}

export type Tool<S extends GenieSchema> = StringKey<S>;

export type OtherTools<S extends GenieSchema, T extends Tool<S>> = Exclude<Tool<S>, T>[] | undefined;

export type Asset<S extends GenieSchema, T extends Tool<S>> = StringKey<S[T]>;
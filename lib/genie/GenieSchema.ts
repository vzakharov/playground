import _ from "lodash";
import { StringKey } from "vovas-utils";
import { AssetCaption } from "./assets";

export type Schema = {

  [ToolName: string]: {
    [AssetName: string]: AssetCaption;
  };
  
}

export type Tool<S extends Schema> = StringKey<S>;

export type OtherTools<S extends Schema, T extends Tool<S>> = Exclude<Tool<S>, T>[] | undefined;
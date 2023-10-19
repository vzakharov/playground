import _ from "lodash";
import { StringKey } from "vovas-utils";
import { AssetCaption } from "./assets";
import { ArrayItem } from "lib/utils";

export type GenieSchema<T extends string=string> = {

  [ToolName in T]: {
    assets: AssetCaption[];
    prerequisites?: T[];
  };
  
}

export type ToolName<S extends GenieSchema> = StringKey<S>;

export type OtherTools<S extends GenieSchema, T extends ToolName<S>> = Exclude<ToolName<S>, T>[] | undefined;

export type AssetName<S extends GenieSchema, T extends ToolName<S>> = StringKey<S[T]['assets']>;

export type Prerequisites<S extends GenieSchema, T extends ToolName<S>> = S[T]['prerequisites'];

export type Prerequisite<S extends GenieSchema, T extends ToolName<S>> = ArrayItem<Prerequisites<S, T>>;

export function getPrerequisites<S extends GenieSchema, T extends ToolName<S>>(schema: S, toolName: T) {
  return schema[toolName].prerequisites as Prerequisites<S, T>;
};
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

export type ToolName<S extends Toolset> = StringKey<S>;

export type OtherTools<S extends Toolset, T extends ToolFrom<S>> = Exclude<ToolFrom<S>, T>[] | undefined;

export type AssetName<S extends Toolset, T extends ToolFrom<S>> = StringKey<S[T]['assets']>;

export type Prerequisites<S extends Toolset, T extends ToolFrom<S>> = S[T]['prerequisites'];

// export type Prerequisite<S extends Toolset, T extends ToolFrom<S>> = ArrayItem<Prerequisites<S, T>>;

export function getPrerequisites<S extends Toolset, T extends ToolFrom<S>>(schema: S, toolName: T) {
  return schema[toolName].prerequisites as Prerequisites<S, T>;
};
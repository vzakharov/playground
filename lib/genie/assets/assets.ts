import _ from "lodash";
import { StringKey } from "vovas-utils";
import { AssetName, Branded, GenieSchema, ToolName } from "..";

// export type AssetCaption = string;

// export function getAssetCaptions<S extends Toolset, T extends ToolFrom<S>>(schema: S, tool: T) {
//   return schema[tool];
// };

// export type AssetValues<S extends Toolset, Ts extends ToolFrom<S> = ToolFrom<S>> = {
//   [T in Ts]: ToolAssetValues<S, T>;
// };

// export type PartialAssetValues<S extends Toolset, Ts extends ToolFrom<S>> =
//   Partial<AssetValues<S, Ts>>;

// export function hasAssetsForTools<
//   S extends Toolset,
//   Ts extends ToolFrom<S>
// >(assetValues: PartialAssetValues<S, Ts>, tools: Ts[]): assetValues is AssetValues<S, Ts> {
//   return !getMissingTools(assetValues, tools).length;
// };

// export type ToolAssetValues<S extends Toolset, T extends ToolFrom<S>> = {
//   [A in AssetName<S, T>]: string;
// };

// export function assetsComplyWithSchema<
//   S extends Toolset,
//   T extends ToolFrom<S>
// >(assetValues: ToolAssetValues<S, T>, schema: S, tool: T): assetValues is ToolAssetValues<S, T> {
//   return _.isEqual(Object.keys(assetValues), Object.keys(schema[tool].assets));
// };
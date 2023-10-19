import _ from "lodash";
import { StringKey } from "vovas-utils";
import { AssetName, Branded, GenieSchema, ToolName } from "..";

// export type AssetCaption = string;

// export function getAssetCaptions<S extends GenieSchema, T extends ToolName<S>>(schema: S, tool: T) {
//   return schema[tool];
// };

// export type AssetValues<S extends GenieSchema, Ts extends ToolName<S> = ToolName<S>> = {
//   [T in Ts]: ToolAssetValues<S, T>;
// };

// export type PartialAssetValues<S extends GenieSchema, Ts extends ToolName<S>> =
//   Partial<AssetValues<S, Ts>>;

// export function hasAssetsForTools<
//   S extends GenieSchema,
//   Ts extends ToolName<S>
// >(assetValues: PartialAssetValues<S, Ts>, tools: Ts[]): assetValues is AssetValues<S, Ts> {
//   return !getMissingTools(assetValues, tools).length;
// };

// export function getMissingTools<
//   S extends GenieSchema,
//   Ts extends ToolName<S>
// >(assetValues: PartialAssetValues<S, Ts>, tools: Ts[]) {
//   return tools.filter(tool => !(tool in assetValues));
// };

// export type ToolAssetValues<S extends GenieSchema, T extends ToolName<S>> = {
//   [A in AssetName<S, T>]: string;
// };

// export function assetsComplyWithSchema<
//   S extends GenieSchema,
//   T extends ToolName<S>
// >(assetValues: ToolAssetValues<S, T>, schema: S, tool: T): assetValues is ToolAssetValues<S, T> {
//   return _.isEqual(Object.keys(assetValues), Object.keys(schema[tool].assets));
// };
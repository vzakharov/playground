import _ from "lodash";
import { StringKey } from "vovas-utils";
import { Asset, Branded, GenieSchema, Tool } from "..";

export type AssetCaption = string;

export function getAssetCaptions<S extends GenieSchema, T extends Tool<S>>(schema: S, tool: T) {
  return schema[tool];
};

export type AssetValues<S extends GenieSchema, Ts extends Tool<S> = Tool<S>> = {
  [T in Ts]: ToolAssetValues<S, T>;
};

export type PartialAssetValues<S extends GenieSchema, Ts extends Tool<S>> =
  Partial<AssetValues<S, Ts>>;

export function hasAssetsForTools<
  S extends GenieSchema,
  Ts extends Tool<S>
>(assetValues: PartialAssetValues<S, Ts>, tools: Ts[]): assetValues is AssetValues<S, Ts> {
  return !getMissingTools(assetValues, tools).length;
};

export function getMissingTools<
  S extends GenieSchema,
  Ts extends Tool<S>
>(assetValues: PartialAssetValues<S, Ts>, tools: Ts[]) {
  return tools.filter(tool => !(tool in assetValues));
};

export type ToolAssetValues<S extends GenieSchema, T extends Tool<S>> = {
  [A in Asset<S, T>]: string;
};

export function assetsComplyWithSchema<
  S extends GenieSchema,
  T extends Tool<S>
>(assetValues: ToolAssetValues<S, T>, schema: S, tool: T): assetValues is ToolAssetValues<S, T> {
  return _.isEqual(Object.keys(assetValues), Object.keys(schema[tool].assets));
};
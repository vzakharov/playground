import _ from "lodash";
import { StringKey } from "vovas-utils";
import { Branded, Schema, Tool } from "..";

export type AssetCaption = string;

export function getAssetCaptions<S extends Schema, T extends Tool<S>>(schema: S, tool: T) {
  return schema[tool];
};

export type Asset<S extends Schema, T extends Tool<S>> = StringKey<S[T]>;

export type AssetValues<S extends Schema, Ts extends Tool<S> = Tool<S>> = {
  [T in Ts]: ToolAssetValues<S, T>;
};

export type PartialAssetValues<S extends Schema, Ts extends Tool<S>> =
  Partial<AssetValues<S, Ts>>;

export function hasAssetsForTools<
  S extends Schema,
  Ts extends Tool<S>
>(assetValues: PartialAssetValues<S, Ts>, tools: Ts[]): assetValues is AssetValues<S, Ts> {
  return !getMissingTools(assetValues, tools).length;
};

export function getMissingTools<
  S extends Schema,
  Ts extends Tool<S>
>(assetValues: PartialAssetValues<S, Ts>, tools: Ts[]) {
  return tools.filter(tool => !(tool in assetValues));
};

export type ToolAssetValues<S extends Schema, T extends Tool<S>> = {
  [A in Asset<S, T>]: string;
};

export function assetsComplyWithSchema<
  S extends Schema,
  T extends Tool<S>
>(assetValues: ToolAssetValues<S, T>, schema: S, tool: T): assetValues is ToolAssetValues<S, T> {
  return _.isEqual(Object.keys(assetValues), Object.keys(schema[tool].assets));
};
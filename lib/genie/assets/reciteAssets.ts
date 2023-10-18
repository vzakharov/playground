import yaml from "js-yaml";
import _ from "lodash";
import { AssetValues, GenieSchema, Tool, getAssetCaptions } from "..";


export function reciteAssets<
  S extends GenieSchema,
  Ts extends Tool<S>
>(assetValues: AssetValues<S, Ts>, schema: S, tools: Ts[]) {

  return yaml.dump(
    _.fromPairs(
      tools.map(tool => [
        tool,
        _.mapKeys(
          assetValues[tool],
          (value, asset) => getAssetCaptions(schema, tool)[asset],
        ),
      ]),
    ),
  );

};

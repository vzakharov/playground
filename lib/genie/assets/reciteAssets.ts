import yaml from "js-yaml";
import { objectWithKeysOf } from "~/lib/utils";
import { AssetValuesForSet, Toolset, replaceKeysWithCaptions } from "..";


export function reciteAssets<
  S extends Toolset
>(assetValues: AssetValuesForSet<S>, tools: S) {

  return yaml.dump(
    objectWithKeysOf(
      tools, 'id',
      (tool, id) => replaceKeysWithCaptions(tool.config.assets, assetValues[id]),
    ),
  );

};

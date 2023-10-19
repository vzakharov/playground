import yaml from "js-yaml";
import { objectWithKeys } from "lib/utils";
import _ from "lodash";
import { AssetValuesForSet, Toolset, toolIds } from "..";


export function reciteAssets<
  S extends Toolset
>(assetValues: AssetValuesForSet<S>, tools: S) {

  return yaml.dump(
    objectWithKeys(
      toolIds(tools),
      toolId => _.mapKeys(
        assetValues[toolId],
        (value, asset) => _.startCase(asset),
        // TODO: Add asset captions instead of start casing
      ),
    ),
  );

};

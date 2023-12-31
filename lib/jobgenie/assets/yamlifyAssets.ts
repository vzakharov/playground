import yaml from "js-yaml";
import { chatTypes } from "../ChatType";
import { isAmong } from "vovas-utils";
import { AssetsMap, getAssetCaptions } from "./assets";


export function yamlifyAssets(assets: Partial<AssetsMap>) {

  return yaml.dump(
    Object.entries(assets).reduce((acc, [type, assets]) => {

      if (!isAmong(chatTypes)(type))
        throw new Error(`Invalid chat type: ${type}`);

      const captions = getAssetCaptions(type);
      Object.entries(assets).forEach(([key, value]) => {
        acc[captions[key as keyof typeof captions]] = value;
      });
      return acc;
    }, {} as Record<string, string>)
  );

}
;

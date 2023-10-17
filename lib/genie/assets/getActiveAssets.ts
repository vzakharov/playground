import _ from "lodash";
import { GenieData, PartialAssetValues, Schema, Tool, assetsComplyWithSchema } from "..";

export function getActiveAssets<
  S extends Schema
>(data: GenieData<S>, schema: S): PartialAssetValues<S, Tool<S>> {

  const result = _.mapValues(schema, (toolSchema, toolName) => {

    const chat = data.chats.find(chat => chat.tool === toolName);
    // TODO: Search by id in addition to type

    if (!chat) return undefined;

    const { tool, messages } = chat; 

    const { assets } = _(messages)
      .filter(m => !!m.assets)
      .sortBy(m => m.assetsPickedAt ?? 0)
      .last() ?? {};
    
    if ( !assets || !assetsComplyWithSchema(assets, schema, tool) ) 
      return undefined;

    return assets;

  });
  
  return result;

};
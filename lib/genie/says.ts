import { ChatRole, chatRoles, says as rawSays } from "~/lib/vovas-openai";
import { objectWithKeys } from "vovas-utils";
import { GenieMessage, withUniqueId } from ".";

export const says = objectWithKeys(
  chatRoles, 
  role => 
    <AssetKey extends string>(
      content: string, 
      params?: Omit<GenieMessage<AssetKey>, 'id' | 'role' | 'content'>
    ) => ({
      ...rawSays[role](content),
      ...params,
      ...withUniqueId()
    })
) as {
    [K in ChatRole]: 
      <AssetKey extends string>(
        content: string, 
        params?: Omit<GenieMessage<AssetKey>, 'id' | 'role' | 'content'>
      ) => GenieMessage<AssetKey, K>;
  };
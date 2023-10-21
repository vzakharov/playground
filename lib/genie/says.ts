import { ChatRole, chatRoles, says as rawSays } from "~/lib/vovas-openai";
import { objectWithKeys } from "vovas-utils";
import { AnyTool, GenieMessage, GenieSchema, ToolName, withUniqueId } from ".";

export const says = objectWithKeys(
  chatRoles, 
  function (role) {
    return <T extends AnyTool | undefined>(
      content: string,
      params?: Omit<GenieMessage<T>, 'id' | 'role' | 'content'>
    ) => ({
      ...rawSays[role](content),
      ...params,
      ...withUniqueId()
    });
  }
) as {
    [R in ChatRole]: 
      <T extends AnyTool | undefined>(
        content: string, 
        params?: Omit<GenieMessage<T>, 'id' | 'role' | 'content'>
      ) => GenieMessage<T, R>;
  };
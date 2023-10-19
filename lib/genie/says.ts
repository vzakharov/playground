import { ChatRole, chatRoles, says as rawSays } from "~/lib/vovas-openai";
import { objectWithKeys } from "vovas-utils";
import { GenieMessage, GenieSchema, ToolName, withUniqueId } from ".";

export const says = objectWithKeys(
  chatRoles, 
  function (role) {
    return <S extends Toolset, T extends ToolFrom<S>>(
      content: string,
      params?: Omit<GenieMessage<S, T>, 'id' | 'role' | 'content'>
    ) => ({
      ...rawSays[role](content),
      ...params,
      ...withUniqueId()
    });
  }
) as {
    [R in ChatRole]: 
      <S extends Toolset, T extends ToolFrom<S>>(
        content: string, 
        params?: Omit<GenieMessage<S, T>, 'id' | 'role' | 'content'>
      ) => GenieMessage<S, T, R>;
  };
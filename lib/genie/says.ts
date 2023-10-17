import { ChatRole, chatRoles, says as rawSays } from "~/lib/vovas-openai";
import { objectWithKeys } from "vovas-utils";
import { GenieMessage, Schema, Tool, withUniqueId } from ".";

export const says = objectWithKeys(
  chatRoles, 
  function (role) {
    return <S extends Schema, T extends Tool<S>>(
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
      <S extends Schema, T extends Tool<S>>(
        content: string, 
        params?: Omit<GenieMessage<S, T>, 'id' | 'role' | 'content'>
      ) => GenieMessage<S, T, R>;
  };
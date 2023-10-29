import { Tool } from "~/lib/genie";
import { Template } from ".";

export function toTool({ id, messages }: Template) {

  return new Tool<string, never, []>(id, {

    requires: [],

    build: () => ({
      pre: messages,
    }),

  });

};
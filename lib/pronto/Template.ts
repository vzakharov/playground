import { AnyTool, GenieMessage } from "lib/genie";

export type Template = {
  id: string;
  messages: GenieMessage<AnyTool>[];
};

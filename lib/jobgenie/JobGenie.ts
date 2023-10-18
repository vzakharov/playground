import { customGenie } from "~/lib/genie";
import { promptBuilders, schema } from ".";

export const JobGenie = customGenie(schema, promptBuilders);
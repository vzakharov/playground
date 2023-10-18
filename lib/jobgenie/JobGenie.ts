import { derivedGenie } from "~/lib/genie";
import { promptBuilders, schema } from ".";

export const JobGenie = derivedGenie(schema, promptBuilders);
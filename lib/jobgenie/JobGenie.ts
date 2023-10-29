import { customGenie } from "~/lib/genie";
import { tools } from "./prompting/tools";


export const JobGenie = customGenie(tools);
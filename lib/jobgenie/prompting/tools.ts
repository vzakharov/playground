import { SetFor, Toolset, ValidToolset } from "~/lib/genie";
import { challenge, dna, job, pitch, resume, social } from "./builders";
import _ from "lodash";

export const tools = [
  dna,
  resume,
  job, 
  pitch,
  challenge,
  social
] satisfies Toolset;

export const toolIds = _.map(tools, 'id');

export type ToolId = typeof toolIds[number];

export type Tools = typeof tools;

export type Tool = Tools[number];


const test = <T extends Toolset>(tools: T & ValidToolset<T>) => { };
test(tools);
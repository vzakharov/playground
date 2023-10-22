import { SetFor, Toolset, ValidToolset } from "~/lib/genie";
import { challenge, dna, job, pitch, resume, social } from "..";
import _ from "lodash";

export const tools = [
  dna,  // Commenting this out should cause a compile-time error below in `test` because other tools require it
  resume,
  job, 
  pitch,
  challenge,
  social
];

export const toolIds = _.map(tools, 'id');

export type ToolId = typeof toolIds[number];

export type Tools = typeof tools;

export type Tool = Tools[number];


const test = <T extends Toolset>(tools: ValidToolset<T>) => { };
test(tools);
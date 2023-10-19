import { Requires, RequiredToolId, ToolDict, ToolFrom, Toolset, RequiredId, ValidToolset } from "~/lib/genie";
import { challenge, dna, job, pitch, resumé, social } from "..";
import { ArrayItem } from "lib/utils";

// export const promptBuilders = {
//   // dna,
//   // resumé,
//   // job,
//   pitch,
//   challenge,
//   social
//  } as const;

export const tools = [
  dna,  // Commenting this out will cause a compile-time error because other tools require it
  resumé,
  job, 
  pitch,
  challenge,
  social
];

export type Tools = typeof tools;

const test = <T extends Toolset>(tools: ValidToolset<T>) => { };
test(tools);
import { SetFor, Toolset, ValidToolset } from "~/lib/genie";
import { challenge, dna, job, pitch, resumé, social } from "..";

export const tools = [
  dna,  // Commenting this out should cause a compile-time error below in `test` because other tools require it
  resumé,
  job, 
  pitch,
  challenge,
  social
];

export type Tools = typeof tools;

const test = <T extends Toolset>(tools: ValidToolset<T>) => { };
test(tools);
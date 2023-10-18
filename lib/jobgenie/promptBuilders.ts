import { $throw } from "vovas-utils";
import { Genie, GenieConfig, PromptBuilder, Tool, findBy } from "~/lib/genie";
import { Schema, challenge, dna, job, pitch, resumé, social } from ".";
import _ from "lodash";

export const promptBuilders = {
  dna,
  resumé,
  job,
  pitch,
  challenge,
  social
 } as const;
import { $throw } from "vovas-utils";
import { Tool, findBy } from "~/lib/genie";
import { Schema, challengeBuilder, dnaBuilder, jobBuilder, pitchBuilder, resuméBuilder, socialBuilder } from "..";

export const promptBuilders = [
  dnaBuilder,
  resuméBuilder,
  jobBuilder,
  pitchBuilder,
  challengeBuilder,
  socialBuilder
] as const;
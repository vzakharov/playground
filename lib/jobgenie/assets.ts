import { ChatType } from "./types";
import { MapToGeneric } from "./utils";


export type AssetsMap = {
  dna: {
    dna: string;
  };
  linkedin: {
    tagline: string;
    bio: string;
    experience: string;
  };
  job: {
    jobTitle: string;
    jobDescription: string;
    whyMe: string;
    whyJob: string;
  };
};

export type Assets<T extends ChatType> = MapToGeneric<AssetsMap, T>;

type TestAssets = AssetsMap['job']

export type AllAssets = Partial<Assets<any>>;

export const assetCaptions: Record<keyof AllAssets, string> = {
  dna: 'DNA',
  tagline: 'Tagline',
  bio: 'Bio',
  experience: 'Experience',
  jobTitle: 'Job title',
  jobDescription: 'Job description',
  whyMe: 'Why me?',
  whyJob: 'Why this job?'
};

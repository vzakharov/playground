import { Chat } from "openai/resources";
import { ChatType } from "./types";
import { MapToGeneric } from "./utils";

export const assetCaptions = {
  dna: {
    dna: 'DNA'
  },
  linkedin: {
    tagline: 'Tagline',
    bio: 'Bio',
    experience: 'Experience'
  },
  job: {
    title: 'Job title',
    description: 'Job description',
    whyMe: 'Why me?',
    whyJob: 'Why this job?'
  }
} satisfies Record<ChatType, Record<string, string>>;

export type AssetsMap = typeof assetCaptions;

export type Assets<T extends ChatType> = {
  [K in keyof AssetsMap[T]]: string;
};

type JobAssets = Assets<'job'>;

export const getAssetCaptions = <T extends ChatType>(type: T) => assetCaptions[type] as Assets<T>;
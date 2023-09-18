import { ChatType } from "./types";

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

export function getAssetCaptions<T extends ChatType>(type: T) {
  return assetCaptions[type] as Assets<T>;
};
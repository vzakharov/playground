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
    title: string;
    description: string;
    whyMe: string;
    whyJob: string;
  };
};

export type Assets<T extends ChatType> = MapToGeneric<AssetsMap, T>;

type TestAssets = AssetsMap['job']

export type AllAssets = Partial<Assets<any>>;
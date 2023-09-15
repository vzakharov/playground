import { ChatType } from "./types";
import { MapToGeneric } from "./utils";

export type AssetsMap = {
  interview: {
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
  };
};

export type Assets<T extends ChatType> = MapToGeneric<AssetsMap, T>;

export type AllAssets = Partial<Assets<any>>;
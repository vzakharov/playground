import { StringKey } from "vovas-utils";
import { WithKeys } from "~/lib/genie";
import { PickByArray } from "~/lib/utils";
import { Tool } from "..";

export const assetCaptions = {
  dna: {
    dna: 'DNA'
  },
  resumé: {
    tagline: 'Tagline',
    bio: 'Bio',
    experience: 'Experience'
  },
  job: {
    title: 'Job title',
    description: 'Job description',
    whyMe: 'Why me?',
    whyJob: 'Why this job?'
  },
  pitch: {
    headline: 'Headline',
    pitch: 'Pitch'
  },
  challenge: {
    question: 'Question',
    answer: 'Answer'
  },
  social: {
    post: 'Post body'
  }
};

export type AssetsMap = typeof assetCaptions;

export type PickAssets<ChatTypes extends Tool[] | undefined> =
  PickByArray<AssetsMap, ChatTypes>;

export type AssetKeyForChatType<T extends Tool> = StringKey<AssetsMap[T]>;

type TestAssetKey = AssetKeyForChatType<'resumé'>;

export type AssetsForChatType<T extends Tool> = WithKeys<AssetKeyForChatType<T>>;

type TestAssets = AssetsForChatType<'resumé'>;

export function getAssetCaptions<T extends Tool>(type: T) {
  return assetCaptions[type] as AssetsForChatType<T>;
};

export function assetsDefinedForChatTypes<
  A extends Partial<AssetsMap>, T extends Tool[] | undefined
>(assets: A, types: T): assets is A & PickAssets<T> {
  return !types || types.every(type => !!assets[type]);
};
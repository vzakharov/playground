import { StringKey } from "vovas-utils";
import { ChatType } from "../ChatType";
import { WithKeys } from "~/lib/genie";

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

export type PickAssets<ChatTypes extends ChatType[] | undefined> = 
  ChatTypes extends ChatType[] 
    ? Pick<AssetsMap, ChatTypes[number]> 
    : {};

// export type Assets<T extends ChatType> = {
//   [K in keyof AssetsMap[T]]: string;
// };

export type AssetKeyForChatType<T extends ChatType> = StringKey<AssetsMap[T]>;

type TestAssetKey = AssetKeyForChatType<'resumé'>;

export type AssetsForChatType<T extends ChatType> = WithKeys<AssetKeyForChatType<T>>;

type TestAssets = AssetsForChatType<'resumé'>;

export function getAssetCaptions<T extends ChatType>(type: T) {
  return assetCaptions[type] as AssetsForChatType<T>;
};

export function assetsDefinedForChatTypes<
  A extends Partial<AssetsMap>, T extends ChatType[] | undefined
>(assets: A, types: T): assets is A & PickAssets<T> {
  return !types || types.every(type => !!assets[type]);
};
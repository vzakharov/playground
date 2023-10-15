import { StringKey } from "vovas-utils";
import { $GenieChatType, Branded, GenieChatType, Unbrand } from "..";

const $assetName = Symbol('$AssetName');
export type $AssetName = typeof $assetName;

export type AssetName<S extends string = string> = Branded<S, $AssetName>;

export type AssetMap<Ts extends GenieChatType> = Record<
  Unbrand<Ts, $GenieChatType>,
  Record<
    Unbrand<AssetName, $AssetName>, 
    string
  >
>;

export type AssetNameForChatType<
  Map extends AssetMap<T>,
  T extends GenieChatType
> = Branded<StringKey<Map[Unbrand<T, $GenieChatType>]>, $AssetName>;

export type AssetsForChatType<
  Map extends AssetMap<T>,
  T extends GenieChatType
> = Map[Unbrand<T, $GenieChatType>];

const testAssetMap = {
  type1: {
    asset1: 'value1',
    asset2: 'value2'
  },
  type2: {
    asset3: 'value3'
  }
} as const;

type TestAssetMap = typeof testAssetMap;

type TestAssetNameForChatType = AssetNameForChatType<TestAssetMap, GenieChatType<'type1'>>;
// =>
// type TestAssetNameForChatType = ("asset1" | "asset2") & {
//   [$assetName]: void;
// }
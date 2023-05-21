export type UtilityTokenSupply = {
  tokenId: number;
  supply: number;
}

export type UtilityTokenConfig = {
  configId: string;
  lockedTokenIds: number[];
}

export type GenericNftMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: GenericNftAttribute[];
}

export type GenericNftAttribute = {
  trait_type: string;
  value: string;
}
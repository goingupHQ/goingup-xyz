type UtilityTokenSupply = {
  tokenId: number;
  supply: number;
}

type UtilityTokenConfig = {
  configId: string;
  lockedTokenIds: number[];
}

type GenericNftMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: GenericNftAttribute[];
}

type GenericNftAttribute = {
  trait_type: string;
  value: string;
}
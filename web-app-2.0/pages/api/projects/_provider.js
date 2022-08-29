import { ethers } from "ethers";

// testnet
export const contractAddress = "0xe0b5f0c73754347E1d2E3c84382970D7A70d666B";
export const contractNetwork = 80001;
export const alchemyKey = process.env.ALCHEMY_POLYGON_TESTNET;

// mainnet
// export const contractAddress = 'NOT_YET_DEPLOYED';
// export const contractNetwork = 137;
// export const alchemyKey = process.env.ALCHEMY_POLYGON_MAINNET;

export const provider = new ethers.providers.AlchemyProvider(contractNetwork, alchemyKey);
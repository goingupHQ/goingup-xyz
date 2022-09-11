import { ethers } from "ethers";

// testnet
export const contractAddress = "0xF5df032832cb3c4BEf2D28B440fA57D5dAC47881";
export const contractNetwork = 80001;
export const alchemyKey = process.env.ALCHEMY_POLYGON_TESTNET;

// mainnet
// export const contractAddress = 'NOT_YET_DEPLOYED';
// export const contractNetwork = 137;
// export const alchemyKey = process.env.ALCHEMY_POLYGON_MAINNET;

export const provider = new ethers.providers.AlchemyProvider(contractNetwork, alchemyKey);
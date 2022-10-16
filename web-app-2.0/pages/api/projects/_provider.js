import { ethers } from "ethers";

// testnet
// export const contractAddress = "0x89e41C41Fa8Aa0AE4aF87609D3Cb0F466dB343ab";
// export const contractNetwork = 80001;
// export const alchemyKey = process.env.ALCHEMY_POLYGON_TESTNET;

// mainnet
export const contractAddress = '0x9C28e833aE76A1e123c2799034cA6865A1113CA5';
export const contractNetwork = 137;
export const alchemyKey = process.env.ALCHEMY_POLYGON_MAINNET;

export const provider = new ethers.providers.AlchemyProvider(contractNetwork, alchemyKey);
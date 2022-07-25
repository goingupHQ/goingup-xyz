import { ethers } from 'ethers';
import artifact from './../../../artifacts/GoingUpNFT.json';

const abi = artifact.abi;
const key = process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_KEY;
export const address = process.env.NEXT_PUBLIC_GOINGUP_UTILITY_TOKEN;
const provider = new ethers.providers.AlchemyProvider(137, key);

export const utilityAddress = address;
export const utilityProvider = provider;
export const utilityInterface = new ethers.utils.Interface(abi);
export const utilityContract = new ethers.Contract(address, abi, provider);
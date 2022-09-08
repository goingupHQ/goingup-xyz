import { ethers } from 'ethers';
import artifact from '../../../artifacts/GoingUpUtilityTokens.json';

export const contractAddress = '0x10D7B3aFA213D93a922a062fb91E8EcbD4A703d2';
export const abi = artifact.abi;
export const provider = new ethers.providers.AlchemyProvider(137, process.env.ALCHEMY_POLYGON_MAINNET);
export const contract = new ethers.Contract(contractAddress, abi, provider);

export default async function handler(req, res) {
    const tokens = [];

    let tokenId = 1;
    while (true) {
        const token = await contract.tokenSettings(tokenId);
        if (!token.description || !token.metadataURI) {
            break;
        }

        tokens.push({
            id: tokenId,
            description: token.description,
            metadataURI: token.metadataURI,
            category: token.category,
            tier: token.tier,
            price: token.price,
        });

        tokenId++;
    }

    res.send(tokens);
}
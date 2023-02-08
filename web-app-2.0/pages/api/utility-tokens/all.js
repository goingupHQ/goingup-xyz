import { ethers } from 'ethers';
import { getDb } from '../_get-db-client';
import artifact from '../../../artifacts/GoingUpUtilityTokens.json';

export const contractAddress = '0x10D7B3aFA213D93a922a062fb91E8EcbD4A703d2';
export const abi = artifact.abi;
// export const provider = new ethers.providers.AlchemyProvider(137, process.env.ALCHEMY_POLYGON_MAINNET);
export const provider = new ethers.providers.JsonRpcProvider(`https://polygon-rpc.com`);
export const contract = new ethers.Contract(contractAddress, abi, provider);

const getToken = async (tokenId) => {
    const token = await contract.tokenSettings(tokenId);

    if (token.category.eq(0) && token.tier.eq(0) && token.price.eq(0)) {
        return null;
    }

    // convert ipfs uri to https uri
    const ipfsParts = token.metadataURI.split('/');
    const ipfsHash = ipfsParts[2];
    const ipfsPath = ipfsParts.slice(3).join('/');
    const ipfsUri = `https://${ipfsHash}.ipfs.nftstorage.link/${ipfsPath}`;

    // download metadata
    const metadataResponse = await fetch(ipfsUri);

    if (!metadataResponse.ok) {
        return null;
    }

    const metadataJson = await metadataResponse.json();

    // convert metadata image uri to https uri
    const metadataImageParts = metadataJson.image.split('/');
    const metadataImageHash = metadataImageParts[2];
    const metadataImagePath = metadataImageParts.slice(3).join('/');
    const metadataImageUri = `https://${metadataImageHash}.ipfs.nftstorage.link/${metadataImagePath}`;
    metadataJson.image = metadataImageUri;

    return {
        id: tokenId,
        description: token.description,
        metadataURI: token.metadataURI,
        metadata: metadataJson,
        category: token.category,
        tier: token.tier,
        price: token.price,
    };
};

export default async function handler(req, res) {
    const tokens = [];

    let tokenId = 1;
    while (true) {
        const token = await getToken(tokenId);
        if (token === null) {
            break;
        }

        tokens.push(token);
        tokenId++;
    }

    // get cached token supply from database
    const db = await getDb();
    const tokenSupply = await db.collection('utility-token-supply').find({}).toArray();

    // add token supply to tokens
    for (const token of tokens) {
        const tokenSupplyRecord = tokenSupply.find((record) => record.tokenId === token.id);
        token.supply = tokenSupplyRecord ? tokenSupplyRecord.supply : 0;
    }

    res.send(tokens);
}

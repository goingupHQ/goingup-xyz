// This script is used to cache extra data like messages on the GoingUP utility token smart contract
// Contract on block explorer: https://polygonscan.com/address/0x10d7b3afa213d93a922a062fb91e8ecbd4a703d2

import { ethers } from 'ethers';
import fs from 'fs';
import { getDb } from './get-db-client.mjs';

export default async function cacheUtilityTokenData() {
    const utilityArtifact = JSON.parse(fs.readFileSync('./artifacts/GoingUpUtilityTokens.json'));
    const polygonProvider = new ethers.providers.AlchemyProvider(137, process.env.ALCHEMY_POLYGON_KEY);

    const contractAddress = '0x10d7b3afa213d93a922a062fb91e8ecbd4a703d2';
    const utilityContract = new ethers.Contract(contractAddress, utilityArtifact.abi, polygonProvider);

    // get last cached block number stored in database
    const db = await getDb();
    const utilityTokenData = await db.collection('utility-token-data').findOne({});
    const lastCachedBlock = utilityTokenData ? utilityTokenData.lastCachedBlock : 29706432;

    // get current block number
    const currentBlock = await polygonProvider.getBlockNumber();

    console.log(`Caching utility token data from block ${lastCachedBlock} to ${currentBlock}`);

    // get all events from last cached block to current block
    const _interface = new ethers.utils.Interface(utilityArtifact.abi);
    const filter = utilityContract.filters.WriteMintData(null, null);
    filter.fromBlock = lastCachedBlock;
    filter.toBlock = currentBlock;
    filter.address = contractAddress;
    const writeMintLogs = await utilityContract.provider.getLogs(filter);
    console.log(`Found ${writeMintLogs.length} WriteMintData events`);

    // save result to database
    if (writeMintLogs.length > 0) {
        const insertResult = await db.collection('utility-mint-data').insertMany(writeMintLogs);
        console.log(`Inserted ${insertResult.insertedCount} documents to utility-mint-data collection`);
    }

    // update last cached block number in database
    const updateResult = await db
        .collection('utility-token-data')
        .updateOne({}, { $set: { lastCachedBlock: currentBlock } }, { upsert: true });
    console.log(`Updated lastCachedBlock to ${currentBlock}`);
}

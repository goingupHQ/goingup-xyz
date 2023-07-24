// This script is used to cache extra data like messages on the GoingUP utility token smart contract
// Contract on block explorer: https://polygonscan.com/address/0x10d7b3afa213d93a922a062fb91e8ecbd4a703d2
import { ethers } from 'ethers';
import { getDb } from './get-db-client';
import { GoingUpUtilityTokens__factory } from './typechain/index';

export default async function cacheUtilityTokenData() {
    const polygonProvider = new ethers.providers.AlchemyProvider(137, process.env.ALCHEMY_POLYGON_KEY);

    const contractAddress = '0x10d7b3afa213d93a922a062fb91e8ecbd4a703d2';
    const utilityContract = GoingUpUtilityTokens__factory.connect(contractAddress, polygonProvider);

    // get last cached block number stored in database
    const db = await getDb();
    const utilityTokenData = await db.collection('utility-token-data').findOne({});
    const lastCachedBlock = utilityTokenData ? utilityTokenData.lastCachedBlock : 29706432;

    // get current block number
    const currentBlock = await polygonProvider.getBlockNumber();

    console.log(`Caching utility token data from block ${lastCachedBlock} to ${currentBlock}`);

    // get all events from last cached block to current block
    const _interface = utilityContract.interface;

    const filter = utilityContract.filters.WriteMintData(null, null);
    filter.address = contractAddress;
    const writeMintLogs = await utilityContract.provider.getLogs({
        fromBlock: lastCachedBlock,
        toBlock: currentBlock,
        address: contractAddress,
        topics: filter.topics,
    });
    console.log(`Found ${writeMintLogs.length} WriteMintData events`);

    // get all transfer events from last cached block to current block with from address 0x0000000000000000000000000000000000000000
    const transferFilter = utilityContract.filters.TransferSingle(
        null,
        '0x0000000000000000000000000000000000000000',
        null
    );

    transferFilter.address = contractAddress;
    const transferLogs = await utilityContract.provider.getLogs({
        fromBlock: lastCachedBlock,
        toBlock: currentBlock,
        address: contractAddress,
        topics: transferFilter.topics,
     });
    console.log(`Found ${transferLogs.length} TransferSingle events`);

    // parse transfer logs
    const parsedTransferLogs = transferLogs.map((log) => {
        const parsedLog = _interface.parseLog(log);
        return {
            tokenId: parsedLog.args.id.toNumber(),
            to: parsedLog.args.to,
            value: parsedLog.args.value,
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
        };
    });

    type TransferLogsByTokenId = {
        [tokenId: string]: {
            tokenId: number;
            totalMinted: number;
        };
    }

    // sum up all transfer events for each token
    const transferLogsByTokenId = parsedTransferLogs.reduce((acc: TransferLogsByTokenId, log) => {
        if (!acc[log.tokenId]) {
            acc[log.tokenId] = {
                tokenId: log.tokenId,
                totalMinted: 0,
            };
        }
        acc[log.tokenId].totalMinted++;
        return acc;
    }, {});

    // increment supply in database for each token
    for (const tokenId in transferLogsByTokenId) {
        const updateResult = await db
            .collection('utility-token-supply')
            .updateOne(
                { tokenId: parseInt(tokenId) },
                { $inc: { supply: transferLogsByTokenId[tokenId].totalMinted } },
                { upsert: true }
            );
        console.log(`Added supply for token ${tokenId} by ${transferLogsByTokenId[tokenId].totalMinted}`);
    }

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

// @ts-nocheck
import { Contract } from 'ethers';
import { getDb } from './../_get-db-client';
import { utilityAddress, utilityInterface, utilityProvider, utilityContract } from './get-utility-contract';

export default async function handler(req, res) {
    const db = await getDb();
    const col = await db.collection('utility-token');
    const utilityVars = await col.findOne({ _id: 'default' });

    const logs = await utilityProvider.getLogs({
        fromBlock: utilityVars.lastProcessedBlock,
        toBlock: 'latest',
        address: utilityAddress,
    })

    const events = logs.map(log => {
        const event: any = utilityInterface.parseLog(log);
        event.transactionHash = log.transactionHash;
        return event;
    }).filter(event => event.name === 'TransferSingle');
    const maxBlock = Math.max(...logs.map(log => log.blockNumber));

    const txHashes = events.map(event => event.transactionHash);
    await db.collection('utility-token-offchain-data')
        .updateMany({ transactionHash: { $in: txHashes } }, { $set: { verified: true }});

    // await col.updateOne({ _id: 'default' }, { $max: { lastProcessedBlock: maxBlock } });

    res.json({ maxBlock, logs, events,  txHashes });
}
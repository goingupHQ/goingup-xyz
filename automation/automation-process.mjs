import 'dotenv/config';
import { ethers } from "ethers";
import fs from 'fs';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true });
await dbClient.connect();
const db = await dbClient.db();

const notifications = await db.collection('notifications');
const accounts = await db.collection('accounts');

const matic = {
    name: 'matic',
    chainId: 137,
    _defaultProvider: (providers) => new providers.JsonRpcProvider('https://polygon-rpc.com')
};
const provider = ethers.getDefaultProvider(matic);

const utilityAddress = '0x10D7B3aFA213D93a922a062fb91E8EcbD4A703d2';
const utilityArtifact = JSON.parse(fs.readFileSync('./artifacts/GoingUpUtilityTokens.json'));
const utilityContract = new ethers.Contract(utilityAddress, utilityArtifact.abi, provider);

utilityContract.on('TransferSingle', async (operator, from, to, tokenId) => {
    console.log(`TransferSingle: ${operator} ${from} ${to} ${tokenId}`);
    const token = await utilityContract.tokenSettings(tokenId);
    console.log(token);

    if (token.category.eq(1)) {
        const now = new Date();
        // appreciation tokens
        const insertResp = await notifications.insertOne({
            address: to,
            message: `You have received a Tier ${tokenId} Appreciation Token from ${operator}`,
            timestamp: now,
            read: false
        });
        console.log(insertResp);

        if (from === '0x0000000000000000000000000000000000000000') {
            const updateResp = await accounts.updateOne({ address: to }, { $push: { mintedUtilityTokens: { tokenId, timestamp: now } } });
            console.log(updateResp);
        }
    }
});

console.info('Event Listener Started');
setInterval(() => {}, 1 << 30);
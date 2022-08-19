import { getDb } from './../../_get-db-client';
import { computeRoot } from './../../_merkle';

export default async function handler(req, res) {
    const db = await getDb();
    const whitelist = await (await db.collection('membership-nft-whitelist').find().toArray()).map(doc => doc.walletAddress);

    const root = `0x${computeRoot(whitelist).toString('hex')}`;

    res.send(root);
}
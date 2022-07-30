import { getDb } from './../../_get-db-client';
import { getProof } from './../../_merkle';

export default async function handler(req, res) {
    const { address } = req.query;
    const db = await getDb();
    const whitelist = await (await db.collection('membership-nft-whitelist').find().toArray()).map(doc => doc.walletAddress);

    const proof = getProof(address, whitelist);

    res.send(proof);
}
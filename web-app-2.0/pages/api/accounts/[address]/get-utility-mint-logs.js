import { getDb } from '../../_get-db-client';

export default async function handler(req, res) {
    const db = await getDb();
    const { address, tokenId } = req.query;

    if (!address) {
        return res.status(400).json({ error: 'Missing address' });
    }

    if (!tokenId) {
        return res.status(400).json({ error: 'Missing tokenId' });
    }

    const paddedAddress = address.replace('0x', '0x000000000000000000000000').toLowerCase();
    const paddedTokenId = `0x${tokenId.toString('hex').padStart(64, '0')}`;

    const mintLogs = await db
        .collection('utility-mint-data')
        .find({
            'topics.1': paddedTokenId,
            'topics.2': paddedAddress,
        }).toArray();


    const utilityTokenData = await db.collection('utility-token-data').findOne({});
    const { lastCachedBlock } = utilityTokenData;

    res.send({ lastCachedBlock, paddedAddress, paddedTokenId, mintLogs });
}
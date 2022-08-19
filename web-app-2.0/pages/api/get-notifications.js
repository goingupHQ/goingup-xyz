import { ethers } from 'ethers';
import { getDb } from './_get-db-client';

export default async function handler(req, res) {
    const { address } = req.query;

    const db = await getDb();

    const notifications = await db
        .collection('notifications')
        .find({ address })
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray();

    res.send(notifications);
}

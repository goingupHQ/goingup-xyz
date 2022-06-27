import { ethers } from 'ethers';
import { getDb } from './_get-db-client';

export default async function handler(req, res) {
    const { address } = req.query;

    const db = await getDb();

    const notifications = await db
        .collection('notifications')
        .updateMany({ address }, { $set: { read: true } });

    res.send(notifications);
}
